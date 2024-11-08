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

// 추천 과목을 기반으로 항상 3개 시간표 조합 생성
function generateTimetables(req, res) {
    const { subjects } = req.body;

    // 추천받은 과목 필터링
    const filteredSubjects = Object.values(timetableData).filter(
        (item) => subjects.includes(item.name)
    );

    // 전공 필수와 선택 과목 구분
    const majorSubjects = filteredSubjects.filter(subj => subj.weight === 3);
    const otherSubjects = filteredSubjects.filter(subj => subj.weight < 3);

    // 전공 필수 과목 조합 생성
    const majorCombinations = getMajorCombinations(majorSubjects);
    const timetables = [];

    // 무조건 3개의 옵션을 만들도록 반복
    while (timetables.length < 3) {
        for (const majors of majorCombinations) {
            let selectedSubjects = [...majors];
            const addedSubjectNames = new Set(majors.map(subject => subject.name)); // 이미 추가된 과목 이름 추적

            const shuffledOthers = shuffleArray(otherSubjects);

            for (const subj of shuffledOthers) {
                if (addedSubjectNames.has(subj.name)) continue; // 이미 추가된 과목 이름은 건너뜀

                let overlap = false;
                for (const selected of selectedSubjects) {
                    if (isOverlap(selected.times, subj.times)) {
                        overlap = true;
                        break;
                    }
                }

                if (!overlap) {
                    selectedSubjects.push(subj);
                    addedSubjectNames.add(subj.name); // 새로 추가된 과목 이름을 추가
                }
            }

            timetables.push(selectedSubjects);

            // 3개의 시간표 조합이 만들어졌다면 루프 종료
            if (timetables.length >= 3) break;
        }
    }

    // 3가지 시간표 조합을 출력
    timetables.slice(0, 3).forEach((timetable, index) => {
        console.log(`\n시간표 옵션 ${index + 1}:`);
        timetable.forEach(subject => {
            console.log(`${subject.name}: ${subject.times.map(time => `${time.day} ${time.startTime}-${time.endTime}`).join(', ')}`);
        });
    });

    res.status(200).json({ message: '추천 시간표 조합이 성공적으로 생성되었습니다.' });
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
