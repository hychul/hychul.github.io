<!-- https://stackoverflow.com/questions/37887168/how-to-pass-environment-variables-to-spark-driver-in-cluster-mode-with-spark-sub -->

spark에서 환경변수를 통해서 배포 phase에 따라 다른 설정 파일을 읽어서

Spark Document<sup>[link](https://spark.apache.org/docs/latest/configuration.html#environment-variables)</sup>에서 확인할 수 있는 것 처럼 FOO키에 bar 항목을 설정하기 위해서 `spark.yarn.appMasterEnv.FOO=bar` 을 `spark-submit` 명령어의 인자로 추가하여 환경변수를 설정 할 수 있다.
