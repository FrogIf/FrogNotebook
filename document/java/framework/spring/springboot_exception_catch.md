# SpringBoot全局异常捕捉

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ShiroException.class)
    @ResponseBody
    public Object handleNoAuthException(HttpServletRequest request, HttpServletResponse response, Exception e) {
        String requestId = RequestUtil.getRequestId();
        logger.error("no auth when processing the request[{}] form action[{}]", requestId, request.getRequestURI(), e);
        return EchoErrorBuilder.builder().code(EchoError.AUTH_FAILURE).message("no auth").requestId(requestId).build();
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Object handOtherException(HttpServletRequest request, HttpServletRequest response, Exception e){
        String requestId = RequestUtil.getRequestId();
        logger.error("internal exception when processing the request[{}] form action[{}]", requestId, request.getRequestURI(), e);
        return EchoErrorBuilder.builder().code(EchoError.INTERNAL_ERROR).message("internal exception").requestId(requestId).build();
    }
}
```

主要是两个注解:

* RestControllerAdvice
* ExceptionHandler