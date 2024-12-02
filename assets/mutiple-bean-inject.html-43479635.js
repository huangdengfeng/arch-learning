import{_ as s,p as a,q as t,a1 as e}from"./framework-a44ba987.js";const p={};function o(c,n){return a(),t("div",null,n[0]||(n[0]=[e(`<h1 id="spring-objectprovider-使用" tabindex="-1"><a class="header-anchor" href="#spring-objectprovider-使用" aria-hidden="true">#</a> Spring ObjectProvider 使用</h1><h2 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景" aria-hidden="true">#</a> 使用场景</h2><p>注入多个同类型的bean，通常在预留bean扩展使用；比<code>BeanPostProcessor</code>更偏应用层。</p><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RestTemplateAutoConfiguration</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Bean</span>
    <span class="token annotation punctuation">@Lazy</span>
    <span class="token annotation punctuation">@ConditionalOnMissingBean</span>
    <span class="token keyword">public</span> <span class="token class-name">RestTemplateBuilderConfigurer</span> <span class="token function">restTemplateBuilderConfigurer</span><span class="token punctuation">(</span><span class="token class-name">ObjectProvider</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">HttpMessageConverters</span><span class="token punctuation">&gt;</span></span> messageConverters<span class="token punctuation">,</span> <span class="token class-name">ObjectProvider</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">RestTemplateCustomizer</span><span class="token punctuation">&gt;</span></span> restTemplateCustomizers<span class="token punctuation">,</span> <span class="token class-name">ObjectProvider</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">RestTemplateRequestCustomizer</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> restTemplateRequestCustomizers<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">RestTemplateBuilderConfigurer</span> configurer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RestTemplateBuilderConfigurer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        configurer<span class="token punctuation">.</span><span class="token function">setHttpMessageConverters</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">HttpMessageConverters</span><span class="token punctuation">)</span>messageConverters<span class="token punctuation">.</span><span class="token function">getIfUnique</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        configurer<span class="token punctuation">.</span><span class="token function">setRestTemplateCustomizers</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token punctuation">)</span>restTemplateCustomizers<span class="token punctuation">.</span><span class="token function">orderedStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">collect</span><span class="token punctuation">(</span><span class="token class-name">Collectors</span><span class="token punctuation">.</span><span class="token function">toList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        configurer<span class="token punctuation">.</span><span class="token function">setRestTemplateRequestCustomizers</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token punctuation">)</span>restTemplateRequestCustomizers<span class="token punctuation">.</span><span class="token function">orderedStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">collect</span><span class="token punctuation">(</span><span class="token class-name">Collectors</span><span class="token punctuation">.</span><span class="token function">toList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> configurer<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5)]))}const l=s(p,[["render",o],["__file","mutiple-bean-inject.html.vue"]]);export{l as default};