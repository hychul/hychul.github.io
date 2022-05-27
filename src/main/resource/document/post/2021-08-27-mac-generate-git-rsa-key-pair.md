Github에서 레포지토리 접근을 위해서 SSH 방식을 지원하는데 이를 위해선 키 등록이 필요하다.

# Solution

## RSA 키 생성

```shell
$ cd ~/.ssh/
$ ssh-keygen -m PEM -t rsa -b 4096 -C "yourmail@email.com"
-t : dsa, rsa, rsa1 과 같은 암호화 알고리즘 선택
-b : key를 만들때 몇 bit의 key를 만들지 결정
-C : 코멘트를 작성
-m : OpenSSH 개인 키와 PEM 개인 키 형식간의 변환하는데 사용
```

기본 rsa 키는 ssh/id_rsa를 사용하기 때문에 이름을 기본값으로 설정하는 것이 좋다.

<!-- https://man.openbsd.org/ssh-keygen.1 -->

## SSH config 설정

생성한 rsa 키를 사용하여 github에 접근하기 위해선 호스트 설정을 추가해야한다.

```shell
$ vi ~/.ssh/config
```

아래와 같은 내용을 등록한다.

```vi
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa

Host git.other.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_other
```

## Github에 공개키 추가

Github의 [Settings]-[SSH and GPG keys]-[New SSH key]에서 생선된 키의 공개키(id_rsa.pub)를 추가한다.

## 연결 테스트

생성한 키로 접근이 가능한지 아래의 명령어로 테스트할 수 있다.

```shell
$ ssh -T git@github.com
```
