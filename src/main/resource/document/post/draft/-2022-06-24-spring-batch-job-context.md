Use the `ExecutionPromotionListener` to pass data to future steps use a (spring) bean to hold inter-step data, e.g. a `ConcurrentHashMap` without further action this data won't be accessible for a re-start access the JobExecutionContext in your tasklet, should be used with caution, will cause thread problems for parallel steps use the new jobscope (introduced with spring batch 3)

Code Example for accessing JobExecution from Tasklet:

1. setting a value

```java
public class ChangingJobExecutionContextTasklet implements Tasklet {

    /** {@inheritDoc} */
    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        // set variable in JobExecutionContext
        chunkContext
                .getStepContext()
                .getStepExecution()
                .getJobExecution()
                .getExecutionContext()
                .put("value", "foo");

        // exit the step
        return RepeatStatus.FINISHED;
    }

}
```

2. extracting a value

```java
public class ReadingJobExecutionContextTasklet implements Tasklet {

    private static final Logger LOG = LoggerFactory.getLogger(ChangingJobExecutionContextTasklet.class);

    /** {@inheritDoc} */
    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        // pull variable from JobExecutionContext
        String value = (String) chunkContext
                                    .getStepContext()
                                    .getStepExecution()
                                    .getJobExecution()
                                    .getExecutionContext()
                                    .get("value");

        LOG.debug("Found value in JobExecutionContext:" + value);

        // exit the step
        return RepeatStatus.FINISHED;
    }
}
```
