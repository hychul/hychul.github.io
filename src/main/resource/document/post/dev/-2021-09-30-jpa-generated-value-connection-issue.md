`@GeneratedValue` 어노테이션에서 아이디를 새로 생성하기 위해 기본의 DB 커넥션 뿐만 아니라 새로운 커넥션을 맺기 위해서 요청을 하게 되고 이게 동시에 여러 커넥션에서 발생하는 경우 레이스 컨디션이 발생하여 타임아웃으로 문제가 발생함.