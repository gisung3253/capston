const fs = require('fs');
const path = require('path');

// 시간표 데이터 로드
const timetableData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/timetable_data.json'), 'utf8'));

// 시간표가 겹치는지 확인하는 함수
function isOverlap(times1, times2) {
    for (const time1 of times1) {
        for (const time2 of times2) {
            if (
                time1.day === time2.day &&
                !(time1.endTime <= time2.startTime || time1.startTime >= time2.endTime)
            ) {
                return true;
            }
        }
    }
    return false;
}

// 각 시간표를 시간 단위 배열로 변환하는 함수
function convertTimetableToSlots(timetable) {
    const slots = [];
    timetable.forEach(subject => {
        subject.times.forEach(time => {
            const startHour = parseInt(time.startTime.split(':')[0], 10);
            const endHour = parseInt(time.endTime.split(':')[0], 10);

            for (let hour = startHour; hour < endHour; hour++) {
                slots.push({ day: time.day, time: hour, title: subject.name });
            }
        });
    });
    return slots;
}

// 추천 과목을 기반으로 시간표 조합 생성
function generateTimetables(req, res) {
    const { subjects } = req.body;

    // 추천받은 과목 필터링
    const filteredSubjects = Object.values(timetableData).filter(
        (item) => subjects.includes(item.name)
    );

    const majorSubjects = filteredSubjects.filter(subj => subj.weight === 3);
    const otherSubjects = filteredSubjects.filter(subj => subj.weight < 3);

    // 전공 필수 과목 조합 생성
    const majorCombinations = getMajorCombinations(majorSubjects);
    const timetables = [];

    // 무조건 3개의 옵션을 만들도록 반복
    while (timetables.length < 3) {
        for (const majors of majorCombinations) {
            let selectedSubjects = [...majors];
            const addedSubjectNames = new Set(majors.map(subject => subject.name));
            const shuffledOthers = shuffleArray(otherSubjects);

            for (const subj of shuffledOthers) {
                if (addedSubjectNames.has(subj.name)) continue;

                let overlap = false;
                for (const selected of selectedSubjects) {
                    if (isOverlap(selected.times, subj.times)) {
                        overlap = true;
                        break;
                    }
                }

                if (!overlap) {
                    selectedSubjects.push(subj);
                    addedSubjectNames.add(subj.name);
                }
            }

            timetables.push(selectedSubjects);
            if (timetables.length >= 3) break;
        }
    }

    // 각 시간표 옵션을 시간 단위 배열로 변환
    const convertedTimetables = timetables.map(timetable => convertTimetableToSlots(timetable));

    // 로그에 출력
    convertedTimetables.forEach((timetable, index) => {
        console.log(`\n시간표 옵션 ${index + 1}:`);
        timetable.forEach(slot => {
            console.log(`Day: ${slot.day}, Time: ${slot.time}, Title: ${slot.title}`);
        });
    });

    res.status(200).json({ timetables: convertedTimetables });
}

// 전공 필수 조합 생성 함수
function getMajorCombinations(majorSubjects) {
    const combinations = [];

    function helper(selected, index) {
        if (index === majorSubjects.length) {
            combinations.push([...selected]);
            return;
        }

        const current = majorSubjects[index];
        let canAdd = true;

        for (const subject of selected) {
            if (isOverlap(subject.times, current.times)) {
                canAdd = false;
                break;
            }
        }

        if (canAdd) {
            selected.push(current);
            helper(selected, index + 1);
            selected.pop();
        }

        helper(selected, index + 1);
    }

    helper([], 0);
    return combinations.filter(combo => combo.length > 0);
}

// 배열을 섞어주는 함수
function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

module.exports = { generateTimetables };
