# 常用打包插件

## maven-jar-plugin使用

**该插件不会处理依赖包**，只会将依赖包放入`manifest  Classpath`中.

- 无依赖时候可执行jar

> 参考网址[https://maven.apache.org/shared/maven-archiver/examples/classpath.html#Make](https://maven.apache.org/shared/maven-archiver/examples/classpath.html#Make)

```
<build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        ...
        <configuration>
          <archive>
            <manifest>
              <mainClass>fully.qualified.MainClass</mainClass>
            </manifest>
          </archive>
        </configuration>
        ...
      </plugin>
    </plugins>
  </build>
```

- 有依赖的可执行jar，**依赖`maven-dependency-plugin`**，将依赖包copy 到平级的lib目录，如果目录层级不通可以调整`classpathPrefix`.

  > 参考网址[https://maven.apache.org/shared/maven-archiver/examples/classpath.html#Prefix](https://maven.apache.org/shared/maven-archiver/examples/classpath.html#Prefix)

  ```
  <project>
    ...
    <build>
      <plugins>
        <plugin>
        	<groupId>org.apache.maven.plugins</groupId>
           <artifactId>maven-jar-plugin</artifactId>
           <configuration>
             <archive>
               <manifest>
                 <addClasspath>true</addClasspath>
                 <classpathPrefix>lib/</classpathPrefix>
                 <mainClass>fully.qualified.MainClass</mainClass>
               </manifest>
             </archive>
           </configuration>
        </plugin>
      </plugins>
    </build>
    <dependencies>
      <dependency>
        <groupId>commons-lang</groupId>
        <artifactId>commons-lang</artifactId>
        <version>2.1</version>
      </dependency>
      <dependency>
        <groupId>org.codehaus.plexus</groupId>
        <artifactId>plexus-utils</artifactId>
        <version>1.1</version>
      </dependency>
    </dependencies>
  </project>
  ```

## maven-dependency-plugin 使用

主要需要用copy-dependency的功能，参考[https://maven.apache.org/plugins/maven-dependency-plugin/examples/copying-project-dependencies.html#](https://maven.apache.org/plugins/maven-dependency-plugin/examples/copying-project-dependencies.html#)

```
<project>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-dependency-plugin</artifactId>
        <version>3.1.2</version>
        <executions>
          <execution>
            <id>copy-dependencies</id>
            <phase>package</phase>
            <goals>
              <goal>copy-dependencies</goal>
            </goals>
            <configuration>
              <outputDirectory>${project.build.directory}/lib</outputDirectory>
              <overWriteReleases>false</overWriteReleases>
              <overWriteSnapshots>false</overWriteSnapshots>
              <overWriteIfNewer>true</overWriteIfNewer>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
```

## maven-assembly-plugin 打包可执行jar

该插件有两种主流打包方式：

- 依赖包打到产出物里面，参考[http://maven.apache.org/plugins/maven-assembly-plugin/usage.html](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html)

  ```
  <project>
    <build>
      <plugins>
        <plugin>
       	<groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-assembly-plugin</artifactId>
          <version>3.3.0</version>
          <configuration>
             <archive>
                  <manifest>
                    <mainClass>org.sample.App</mainClass>
                  </manifest>
              </archive>
            <descriptorRefs>
              <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
          </configuration>
          <executions>
            <execution>
              <id>make-assembly</id> <!-- this is used for inheritance merges -->
              <phase>package</phase> <!-- bind to the packaging phase -->
              <goals>
                <goal>single</goal>
              </goals>
            </execution>
          </executions>
          </plugin>
      </plugins>
  </project>
  ```

- 打包成具有目录结构的压缩包

  ```
  <!-- 打包成结构化的包 -->
  <plugin>
  	<artifactId>maven-assembly-plugin</artifactId>
  	<configuration>
          <attach>false</attach>
          <appendAssemblyId>false</appendAssemblyId>
          <descriptors>
              <descriptor>
              ${project.parent.basedir}/build/assembly/assembly.xml
              </descriptor>
          </descriptors>
  	</configuration>
      <executions>
          <execution>
              <id>make-assembly</id>
              <phase>package</phase>
              <goals>
              	<goal>single</goal>
              </goals>
          </execution>
      </executions>
  </plugin>
  ```

  ```
  # 常用assembly.xml
  <?xml version="1.0" encoding="UTF-8"?>
  <assembly>
      <!-- 可自定义，这里指定的是项目环境 -->
      <id>release</id>
  
      <!-- 打包的类型，如果有N个，将会打N个类型的包 -->
      <formats>
          <format>tar.gz</format>
          <format>dir</format>
      </formats>
  
      <includeBaseDirectory>true</includeBaseDirectory>
         <!--第三方依赖设置 可以配合jar plugin classpathPrefix-->
        <dependencySets>
            <dependencySet>
                <!-- 不使用项目的artifact，第三方jar不要解压，打包进zip文件的lib目录 -->
                <useProjectArtifact>false</useProjectArtifact>
                <outputDirectory>lib</outputDirectory>
                <unpack>false</unpack>
            </dependencySet>
        </dependencySets>
      <fileSets>
          <!--
              0755->即用户具有读/写/执行权限，组用户和其它用户具有读写权限；
              0644->即用户具有读写权限，组用户和其它用户具有只读权限；
              include 通配符说明 ** 任意目录(可以多级)，*为名称，eg:**/*.xml
          -->
          <!-- 将src/main/assembly/bin目录下的所有文件输出到打包后的bin目录中 -->
          <fileSet>
              <directory>${project.parent.basedir}/build/assembly/bin</directory>
              <outputDirectory>bin</outputDirectory>
              <fileMode>0755</fileMode>
              <includes>
                  <include>*.sh</include>
              </includes>
          </fileSet>
          <!-- 基本配置文件 -->
          <fileSet>
              <directory>${project.parent.basedir}/build/assembly/conf</directory>
              <outputDirectory>conf</outputDirectory>
              <fileMode>0644</fileMode>
          </fileSet>
          <!-- log 目录 -->
          <fileSet>
              <directory>${project.parent.basedir}/build/assembly/logs</directory>
              <outputDirectory>logs</outputDirectory>
              <fileMode>0644</fileMode>
          </fileSet>
  
          <!-- 将项目启动jar打包到boot目录中 -->
          <fileSet>
              <directory>${basedir}/target</directory>
              <outputDirectory>bin</outputDirectory>
              <fileMode>0755</fileMode>
              <includes>
                  <include>${project.build.finalName}.jar</include>
              </includes>
          </fileSet>
      </fileSets>
  </assembly>
  ```
## maven-antrun-plugin 打包出指定目录结构

  ```
   <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-antrun-plugin</artifactId>
                <executions>
                    <execution>
                        <id>copy-to-package-main</id>
                        <phase>package</phase>
                        <configuration>
                            <tasks>
                                <copy todir="target/package/main/bin">
                                    <fileset dir="target/">
                                        <include name="*.jar"></include>
                                    </fileset>
                                    <fileset dir="bin/">
                                        <include name="*.sh"></include>
                                    </fileset>
                                </copy>
                                <copy todir="target/package/conf">
                                    <fileset dir="src/main/resources">
                                        <include name="application.properties"></include>
                                        <include name="spring-logback.xml"></include>
                                    </fileset>
                                </copy>
                                <chmod dir="target/package/main/bin" perm="755"
                                        includes="**/*.sh"/>
                            </tasks>
                        </configuration>
                        <goals>
                            <goal>run</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
  ```


