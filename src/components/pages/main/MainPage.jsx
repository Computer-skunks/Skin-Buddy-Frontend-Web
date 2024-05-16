import { React, useState, useEffect } from "react";
import {
    Link,
    useNavigate, /* 페이지 이동을 위해 */
} from "react-router-dom";
import Navbar from "../../auth/Navbar"; // 상단바 Component import
import styles from "./MainPage.module.css"; // MainPage.module.css import
import axios from "axios"; // api 통신을 위해 axios install & import
import Chart from 'chart.js/auto'; // Chart.js import

function MainPage(props) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const currentId = localStorage.getItem("ID"); // 현재 로그인된 아이디 가져오기
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 상태 여부 저장

    // 메인페이지 정보 반환
    const returnMainInformation = () => {
        const apiUrl = 'http://52.79.237.164:3000/manager/home/user'; // 메인페이지 정보 반환 API URL

        // axios를 이용하여 GET 요청 보내기
        axios.get(apiUrl)
            .then(response => {
                // 요청이 성공한 경우 응답한 데이터 처리
                console.log('메인페이지 정보 반환 응답: ', response.data);
                setData(response.data);
                drawLineChart(response.data); // 데이터를 기반으로 선 그래프 그리기
            })
            .catch(error => {
                // 요청이 실패한 경우 에러 처리
                console.error('메인페이지 정보 반환 오류 발생: ', error);
            })
    }
    
    // 페이지 렌더링 처음에 자동 목록 반환
    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/LoginPage"); // 로그인 페이지로 이동
        } else {
            returnMainInformation();
        }
    }, []);

    // 선 그래프 그리기
    const drawLineChart = (data) => {
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['DRNT', 'DRNW', 'DRPT', 'DRPW', 'DSNT', 'DSNW', 'DSPT', 'DSPW', 'ORNT', 'ORNW', 'ORPT', 'ORPW', 'OSNT', 'OSNW', 'OSPT', 'OSPW'],
                datasets: [{
                    label: 'Data',
                    data: [
                        data.DRNT, data.DRNW, data.DRPT, data.DRPW,
                        data.DSNT, data.DSNW, data.DSPT, data.DSPW,
                        data.ORNT, data.ORNW, data.ORPT, data.ORPW,
                        data.OSNT, data.OSNW, data.OSPT, data.OSPW
                    ],
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return (
        <div className={styles.mainWrapper}>
            <Navbar></Navbar>
            <div className={styles.mainContainer}>
                <p className={styles.mainText}>현재 가입자 수</p>
                <div className={styles.contentBox}>{data.userCount}</div>
                <div className={styles.contentBox2}>
                    <div className={styles.adBox}>
                        <p className={styles.mainText2}>현재 진행 중인 광고</p>
                        <div className={styles.adContentBox}></div>
                    </div>
                    <div className={styles.graphBox}>
                        <p className={styles.mainText2}>현재 사용자 유형 분포도</p>
                        <div className={styles.graphContentBox}>
                            <canvas id="myChart"></canvas> {/* 선 그래프를 그릴 캔버스 */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
