Noyebot
=======
적당히 쓸만한 디코 봇
# 시작하기
* ```git clone https://github.com/codingnoye/noyebot```으로 봇을 가져온다.
* ```cd noyebot```으로 디렉토리에 들어간다.
* ```npm install```로 node 의존성을 설치한다. 
* [디코 개발자 포탈](https://discordapp.com/developers/applications/)로 가서 봇을 만들고 토큰을 가져온다.
* ```config.preview.js```를 ```config.js```로 복사하고 토큰을 넣는다.
* ```npm start```로 봇을 실행한다. 
# 폴더 구조
* ```cmds/``` : 명령어 파일들이 들어 있음. 안에 파일 만들면 알아서 명령어에 추가됨. extension에 넣는 걸 권장, disabled에 넣어 비활성화
* ```data/``` : 데이터가 저장되는 영역. 건들지 않는 걸 추천
* ```lib/``` : 라이브러리 영역.
* ```plugins/``` : 플러그인 영역. 안에 파일 만들면 알아서 적용됨.
* ```src/``` : 소스 영역. 열어봤자 지저분한 코드밖에 없음.
* ```index.js``` : 엔트리 포인트.
* ```config.js``` : 설정 영역. 여기다 토큰을 넣어야 봇이 굴러감.
# 명령어 추가하기
```echo.js```를 보자.
```js
module.exports = {
    func : (msg, barrel, param) => {
        if (param.length != 0) {
            msg.channel.send(`${param}`)
        } else {
            msg.channel.send("인자를 입력해 주세요.")
        }
    },
    keyword : 'echo',
    help : '도움말을 보여줍니다.'
}
```
* 규격에 맞춰 module.exports를 하나 내보내면 된다.
* ```func (msg, barrel, param) => {}``` : msg는 discord.js 의 msg객체를 그대로 전달해 주고, param은 명령어 뒷부분의 인자들을 텍스트로 그대로 입력한다. barrel은 저장공간에 접근할 수 있도록 barrel 객체를 준다. barrel은 아래에서 더 설명함.
* ```keyword```는 호출 키워드이다.
* ```help```는 도움말이다.'
* 솔직히 문서를 너무 빈약하게 적은 것 같으니, 잘 모르겠으면 ```cmds/core/```의 기본 명령어를 참고하자. 
-----
* 명령어는 파일로 넣으면 알아서 등록된다.
* keyword와 help는 알아서 도움말에 등록된다.
# barrel 객체
일종의 저장 가능한 JSON을 구현하기 위해 만든 클래스.
```js
const barrel1 = new Barrel('파일이름')
// data/파일이름.json
```
와 같은 방법으로 배럴 객체를 생성할 수 있다. 이미 존재하는 파일이라면 불러오고, 아니라면 생성해서 불러온다. baekjoon 플러그인의 main.js를 보면 그를 확인할 수 있다.
```js
barrel1.data // 배럴의 데이터 전체는 이곳에 담긴다. 저장하면 이 객체의 내용이 JSON화 된다.
barrel1.save() // 배럴을 저장한다.
barrel1.data[msg.guild.id] // 확장을 만드려면 서버별로 데이터를 따로 저장하는 것이 좋을 것이다.
// 세팅 파일은 서버별로 하나의 배럴을 가지는 식으로 구현되어 있음.
// 모든 배럴은 data/ 밑에 저장되어 있다.
```
일단은 이런 식으로 만들어 두긴 했는데, 플러그인의 권한 제한은 없으니 맘에 안 들면 알아서 짜면 된다.
# 플러그인
```plugin/disabled/example/main.js```를 보자.
```js
const plugin = {
    name: 'example',
    desc: '아무 기능이 없는 테스트 플러그인입니다.',
    load (container) {
        debug.log('example: 플러그인 로드 완료', 2)
    },
    guildLoad (guild) {
        debug.log('example: 서버 로드')
    },
    message (msg) {
        debug.log('example: 메시지 받음')
    },
    command (msg, keyword, param) {
        if (keyword == "echo2") {
            msg.channel.send(param)
            return true
        }
        return false
    },
    help (msg) {
        msg.channel.send('example 플러그인의 도움말입니다.')
    }
}
module.exports = plugin
```
* 아래의 요소만 채워서 ```module.exports``` 해주면 된다.
* 로딩은 알아서 되고, ```plugin/enabled/플러그인이름/main.js```를 불러온다.
* ```name``` : 플러그인의 이름을 나타내는 문자열
* ```desc``` : 플러그인의 설명
* ```guildLoad``` : 서버가 로드되었을 때 작동하는 함수
* ```message``` : 메시지를 받았을 때 작동하는 함수
* ```command``` : 메시지 객체, 키워드, 인자를 넘겨받는 함수. true를 반환하면 이 플러그인에 해당 명령어가 있었다는 말이다. 기본 명령어와의 충돌을 고려해서 만든 영역이다.
* ```help``` : 플러그인의 도움말을 보여주는 함수. embed를 사용하면 좋다.
* 플러그인 폴더 내에서 무슨 짓을 해도 괜찮으니 API만 위 형식을 맞추면 된다.
* 마찬가지로 문서가 빈약한 것 같으니 ```plugins/enabled/```를 참고하자. 근데 baekjoon 플러그인밖에 없고 그거도 지저분하다. 더 좋은 플러그인을 누가 만들어주면 좋겠다 흑흑
# 기타
* 디스코드 ```코딩노예 #1483```
* PR 해주세요