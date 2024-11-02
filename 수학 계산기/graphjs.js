document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("inputField");
    const canvas = document.getElementById("coordinatePlane");
    const ctx = canvas.getContext("2d");
    const offsetX = canvas.width / 2; // X축 중간
    const offsetY = canvas.height / 2; // Y축 중간
    const scale = 40; // 격자 간격을 40으로 설정

    // 좌표 평면 그리기
    function drawCoordinatePlane() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
        
        // 격자 그리기
        ctx.strokeStyle = "#ccc"; // 격자 색상
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += scale) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += scale) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();

        // X축
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(canvas.width, offsetY);
        ctx.strokeStyle = "#000"; // 검정색
        ctx.stroke();

        // Y축
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, canvas.height);
        ctx.stroke();
    }

    // 그래프 그리기
    function drawGraph(expression) {
        const parsedExpression = expression.replace(/x/g, '(x)');
        ctx.beginPath();
        ctx.strokeStyle = "#ff0000"; // 빨간색 그래프
        
        for (let x = -offsetX / scale; x < offsetX / scale; x += 0.1) {
            try {
                const y = eval(parsedExpression); // 수식을 eval로 계산
                const canvasX = offsetX + (x * scale);
                const canvasY = offsetY - (y * scale);
                if (x === -offsetX / scale) {
                    ctx.moveTo(canvasX, canvasY); // 첫 점으로 이동
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            } catch (error) {
                console.error("그래프 계산 중 오류 발생:", error);
                break; // 오류 발생 시 루프 종료
            }
        }
        ctx.stroke();
    }

    // 그래프 그리기 버튼 클릭 시
    document.getElementById("drawButton").addEventListener("click", () => {
        drawCoordinatePlane();
        const expression = inputField.value;
        drawGraph(expression);
    });

    // 키보드 입력 처리
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            drawCoordinatePlane();
            const expression = inputField.value;
            drawGraph(expression);
        }
    });

    // 초기 상태에서 좌표 평면 및 격자 그리기
    drawCoordinatePlane();
});
