import{_ as e,p as n,q as s,a1 as i}from"./framework-a44ba987.js";const r={};function t(l,a){return n(),s("div",null,a[0]||(a[0]=[i(`<h1 id="企业级java-脚手架" tabindex="-1"><a class="header-anchor" href="#企业级java-脚手架" aria-hidden="true">#</a> 企业级Java 脚手架</h1><h2 id="说明" tabindex="-1"><a class="header-anchor" href="#说明" aria-hidden="true">#</a> 说明</h2><p>在企业内部，大量Java工程建立，需要有一定的规范及标准。制定属于企业内部自己的脚手架，可以提高开发效率，促进代码review，让团队成员有一致的开发思想的共识。为日后快速迭代升级打下坚实的基础。</p><h2 id="工程规划" tabindex="-1"><a class="header-anchor" href="#工程规划" aria-hidden="true">#</a> 工程规划</h2><ul><li><strong>统一父POM</strong>：统一maven仓库，公共依赖清单，公共组件，打包形式等，产出物规范等；</li><li><strong>统一运维脚本</strong>：运维脚本统一维护，通过打包时候可以完成升级；</li><li><strong>统一工程结构</strong>：采用maven多模块的项目结构，采用DDD的思想对代码职责分层；</li><li><strong>统一基础框架</strong>：以spring boot为基础，内部微服务调用采用dubbo tripe协议（兼容grpc），http服务采用spring mvc；</li><li><strong>统一代码风格</strong>：使用统一的code style插件及规范；</li></ul><h2 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构" aria-hidden="true">#</a> 项目结构</h2><p>项目主体目录布局介绍</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>seezoon-standard  父工程
├── archetypes 定制的maven骨架，快速生成企业制定的基础工程
│   └── quickstart 开箱即用工程骨架
│   └── fast 快速开发骨架
│   └── micro 微服务开发骨架
├── bom 管理企业内部开源框架依赖及自身组件库版本
├── build 打包部署，包含运维脚本，maven打包自动解压使用
├── samples 编写适合企业的样例程序，通过该程序，也可以制作脚手架（Maven Archetype)
│   └── application-archetype-demo 开箱即用工程骨架工程示例
│   └── application-archetype-fast 快速开发框架示例
│   └── application-archetype-micro 微服务
├── seezoon 企业级父POM，通过升级该版本可以升级依赖，公共组件等
├── seezoon-generator-maven-plugin 代码生成，仓储、dao代码生成
├── starters 企业可以制定自己的starters
│   ├── ddd-spring-boot-starter ddd 基础对象、异常、错误定义等
│   └── mybatis-spring-boot-starter 对mybatis的基础封装，如果不喜欢可以换成mybatis plus
├── tools  工具
│   ├── code 代码相关工具  
│   │   └── checkstyle.xml 代码检查，早期建议可以不关注，按大公司的标准会增加太多工作量
│   │   └── eclipse-codestyle.xml 代码格式化（强制）
│   └── maven
│       └── settings.xml 制定全员通用的文件
└── pom.xml 包含基础maven仓库，部署仓库等
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="快速体验" tabindex="-1"><a class="header-anchor" href="#快速体验" aria-hidden="true">#</a> 快速体验</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># com.your.groupid 按需替换</span>
<span class="token comment"># your-artifactid 按需替换</span>
mvn archetype:generate <span class="token punctuation">\\</span>
    <span class="token parameter variable">-DarchetypeGroupId</span><span class="token operator">=</span>com.seezoon.archetype <span class="token punctuation">\\</span>
    <span class="token parameter variable">-DarchetypeArtifactId</span><span class="token operator">=</span>quickstart <span class="token punctuation">\\</span>
    <span class="token parameter variable">-DarchetypeVersion</span><span class="token operator">=</span><span class="token number">1.0</span>.0-SNAPSHOT <span class="token punctuation">\\</span>
    <span class="token parameter variable">-DgroupId</span><span class="token operator">=</span>com.your.groupid <span class="token punctuation">\\</span>
    <span class="token parameter variable">-DartifactId</span><span class="token operator">=</span>your-artifactid <span class="token punctuation">\\</span>
    <span class="token parameter variable">-Dversion</span><span class="token operator">=</span><span class="token number">1.0</span>.0-SNAPSHOT <span class="token punctuation">\\</span>
    <span class="token parameter variable">-DinteractiveMode</span><span class="token operator">=</span>false
    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="源代码" tabindex="-1"><a class="header-anchor" href="#源代码" aria-hidden="true">#</a> 源代码</h2><p>https://github.com/seezoon/seezoon-standard</p>`,12)]))}const c=e(r,[["render",t],["__file","index.html.vue"]]);export{c as default};
