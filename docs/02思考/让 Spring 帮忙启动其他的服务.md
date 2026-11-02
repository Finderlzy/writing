---
createdDate: 2026-11-02
tags:
  - SpringBoot
  - GPT-SoVITS
  - 进程管理
  - Java
description: "每次测试服务前都要手动打开 GPT-SoVITS 接口，于是尝试用 Spring 的 ProcessBuilder 自己启动 GSV，并讨论如何轮询确认服务是否可用。"
slug: spring-launch-gsv-process
---
由于我每次在测试我的服务有没有问题之前，都需要先去手动打开 [[02思考/接口与GSV 的合成接口| GSV 的接口服务]]，于是我就想，是否可以让 Spring 帮我启动呢？

虽然没有一个类可以直接帮我们启动，但是有一个类叫做 `ProcessBuilder` ，它的名字直译过来是“进程构造者”。我们都知道，程序运行起来，就成了进程，所以这个类可以用来帮助我们启动别的服务。它的原理是，**我们把启动服务的命令准备好，这个类会用这个命令让操作系统[[02思考/操作系统|创建一个进程]]**。

我们可以自己创建一个 `Launcher` 类，在里面实现启动 GSV 的业务：
```java
@Component // 为了让 Spring 帮助我们启动，所以我们要让这个类归 Spring 管理，因此要打标签。由
           // 于这个类不属于请求的处理、业务逻辑和数据库，因此就用普通的@Component
           
           
public class GsvLauncher { // 类：负责启动、关闭 GSV


private final String baseUrl; // 变量：GSV 地址，如 http://127.0.0.1:9880
private final String gsvHome; // 变量：GPT-SoVITS 目录
private final String python; // 变量：GPTSoVits 环境里的 python

private Process process; // 变量：我们启动的 GSV 进程；手动开着的情况下是 null

// 构造方法：Spring 从配置里读值传进来
public GsvLauncher(@Value("${gsv.base-url}") String baseUrl,
				   @Value("${gsv.home}") String gsvHome,
				   @Value("${gsv.python}") String python)
{
this.baseUrl = baseUrl;
this.gsvHome = gsvHome;
this.python = python;
}

  
// 这个标签贴在方法上，告诉 Spring ：对象创建好后，Spring 自动调用一次这个启动方法
@PostConstruct
public void start() throws Exception {

	URI uri = URI.create(baseUrl); //变量：从 base-url 里拆出主机和端口，保证只有一个来源
	System.out.println("[GSV] 正在启动，日志写在 gsv.log ...");
	
	ProcessBuilder pb = new ProcessBuilder( // 变量 pb：要运行的命令
		python, "api_v2.py",
		"-a", uri.getHost(),
		"-p", String.valueOf(uri.getPort()),
		"-c", "GPT_SoVITS/configs/tts_infer.yaml");
		
	pb.directory(new File(gsvHome)); // 相当于先 cd 到 GPT-SoVITS 目录
	pb.environment().put("no_proxy", "localhost,127.0.0.1,0.0.0.0"); // 相当于 export no_proxy=...
	pb.redirectErrorStream(true); // 错误输出和普通输出合在一起
	pb.redirectOutput(new File("gsv.log")); // 都写进 gsv.log
	
	// 把命令准备好之后，调用 start() 方法真正启动进程，并返回一个 process
	process = pb.start();
}

  
// 这个标签贴在方法上，告诉 Spring ：程序关闭前，Spring 自动调用这个关闭方法
@PreDestroy
public void stop() throws InterruptedException {

	if (process != null && process.isAlive()) { // 只关我们自己启动的
	
		System.out.println("[GSV] 正在关闭 ...");
		process.destroy(); // 先礼貌地请它退出

		if (!process.waitFor(10, TimeUnit.SECONDS)) {
			process.destroyForcibly(); // 10 秒还没退出，就强制结束
		}

	}

}
```

不过一个进程启动了，并不意味着这个服务可以使用了，因为可能会卡住，或者报错。因此我们需要在启动服务的时候**轮询**确认服务正在启动，在使用之前**检查服务有返回值**。