/**
 * Created by mac on 29/10/2016.
 */
var issue = {
    // id: "12345", //sn
    ref: null,
    root_id: "12345",
    parent_id: "13234",
    is_main_issue: true, // Main issu
    level: 0, // root is 0 level
    post_date: "2016/09/01",
    user_id: '123', // serial id
    user_image: 'aaa.png',
    top_image: "xxx.png",
    issue_category: "위안부 합의",
    relation: "없음", //  메인이슈 "없음, 서브이슈 "원인 | 결과 | 연관"
    title: "한일 정상 회담서 불거진 소녀상 문제, 논란 계속",
    // contents: "박근혜 대통령이 7박8일 해외순방을 마치고 ..... ",
    contents: [
        { type: "text", value : '박근혜 대통령이 일본군 위안부 문제와 관련해 “과거의 상처를 어루만지고 치유할 수 있는 결단을 내려야 한다 라고 말했다. 아베 신조 일본 총리가 지난 2일 한일정상회담 당시 합의에도 이후 법적으로 해결이 끝났다는 입장에 변화가 없다 라고 말하는 등 위안부 문제 해결에 미온적인 반응을 나타내고 있는 것에 대한 재촉구다.' },
        { type : "image", is_main:'true', value : "http://image.hankookilbo.com/i.aspx?Guid=249573a1fc984274aef22e31bd999c1a&Month=20150625&size=640", main: false },
        { type : "text", value : '박 대통령은 13일 아시아태평양 뉴스통신사 기구(OANA) 소속 회원사 등과 한 공동 인터뷰에서 "일본군 위안부 피해자 문제는 단순한 한일 양국 간 문제가 아니라 보편적 여성 인권의 문제"라면서 이 같이 말했다.' },
        { type : "image", is_main:'false',value : "http://www.worldyan.com/news/photo/201511/10567_16001_5841.jpg", main: true },
        { type : "text", value : '앞서 박 대통령과 아베 총리는 정상회담 당시 "가능한 조기에 위안부 피해자 문제를 타결하기 위한 협의를 가속화하자"며 합의했다. 그러나 일본 측은 지난 12일 위안부 문제 해결을 위한 제10차 국장급 협의에서 일본 대사관 앞 위안부 소녀상 철거를 요구하는 등 진정성이 의심스러운 태도를 드러내고 있다.' },
    ],
    tags: "위안부, 정상회담",
    like: 1234345,
    dislike: 143,
    location: {
        location_nation: "Korea", // nation code
        location_city: "Seoul", // city code, nuallable
        lat: 51.0, // get data from gps
        lng: -0.1 // get data from gps
    },
    vote: {
        question: "소녀상이 이전되어야 한다고 생각하십니까?",
        answers: [
            "네. 그렇습니다.",
            "아니오."
        ]
    },
    comments: [
        {
            email:"uqere@abc.com",
            name: "KilDong",
            image: "a.png",
            date: "2016.10.13",
            text: "소녀상은 지켜져야 한다."
        },
        {
            email:"uqere@abc.com",
            name: "KilDong",
            image: "a.png",
            date: "2016.10.13",
            text: "소녀상은 지켜져야 한다."
        }
    ],
    created: new Date(),     //등록일
    modified: new Date(),  //마지막 로그인 일시
}