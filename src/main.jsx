import React, {useState, useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowUpRight, ArrowDown, ArrowRight, Plus, X, Play, Pause, Copy, Check, Menu} from 'lucide-react';
import './style.css';
import './interactions.css';
import './motion.css';
import {usePortfolioMotion} from './usePortfolioMotion';

const img = (id,w=1800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const projects = [
 {id:'01',title:'《创伤》',en:'《创伤》',type:'影像作品',year:'完整版',video:'/videos/trauma/index.m3u8',poster:'/videos/trauma-poster.jpg',desc:'《创伤》完整作品。可在播放器中观看、调整音量、拖动进度或切换全屏。',role:'作品展映 / 完整版'}
];
const abilities = [
 ['01','从创意，到分镜','AI 影视策划与分镜','使用 Deepseek、Codex 辅助剧本与分镜拆解，结合对热点的敏感度，梳理内容方向与镜头表达。','Deepseek · Codex'],
 ['02','让想法，成为画面','AI 视觉与视频生成','使用 Midjourney、Nano banana、Gptimage 进行图片生成，以 seedance2.5 作为主要 AI 视频生成工具。','Midjourney · Nano banana · Gptimage · seedance2.5'],
 ['03','把细节，落到成片','视频剪辑与协作','使用 PR、AE、剪映完成视频剪辑。做事细心严谨，重视沟通与团队协作，具备分析问题、持续学习与解决问题的能力。','Premiere Pro · After Effects · 剪映']
];
function FilmPlayer({src,title,poster}){
 const [failed,setFailed]=useState(false);
 const player=useRef(null);
 useEffect(()=>{
  let disposed=false,hls;
  const element=player.current;
  setFailed(false);
  if(element.canPlayType('application/vnd.apple.mpegurl'))element.src=src;
  else import('hls.js').then(({default:Hls})=>{
   if(disposed)return;
   if(!Hls.isSupported()){setFailed(true);return;}
   hls=new Hls({maxBufferLength:20,maxMaxBufferLength:30});
   hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)setFailed(true);});
   hls.loadSource(src);hls.attachMedia(element);
  }).catch(()=>{if(!disposed)setFailed(true);});
  return()=>{disposed=true;hls?.destroy();element.pause();element.removeAttribute('src');element.load();};
 },[src]);
 return <><video ref={player} className="film-player" poster={poster} controls playsInline preload="metadata" aria-label={title+'完整作品'} onError={()=>setFailed(true)}/>{failed&&<p className="film-error" role="status">视频暂时无法加载，请检查网络后关闭并重新打开作品。</p>}</>;
}
function App(){
 usePortfolioMotion();
 const [navFloating,setNavFloating]=useState(false);
 useEffect(()=>{
   const hero=document.getElementById('home');
   const header=document.querySelector('header.nav');
   let frame=0;
   const update=()=>{frame=0;setNavFloating(hero.getBoundingClientRect().bottom<=header.offsetHeight);};
   const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
   update();
   window.addEventListener('scroll',schedule,{passive:true});
   window.addEventListener('resize',schedule);
   return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
 },[]);
 const [active,setActive]=useState(null),[paused,setPaused]=useState(false),[menu,setMenu]=useState(false),[copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false),[videoError,setVideoError]=useState(false); const video=useRef(null),closeButton=useRef(null),trigger=useRef(null);
 useEffect(()=>{if(!active)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';closeButton.current?.focus();const key=e=>{if(e.key==='Escape')setActive(null);if(e.key==='Tab'){const items=[...closeButton.current.closest('[role=dialog]').querySelectorAll('button, video[controls], a[href]')];const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}} };window.addEventListener('keydown',key);return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',key);trigger.current?.focus();}},[active]);
 const toggleVideo=async()=>{if(!video.current)return;if(paused){try{await video.current.play();setPaused(false)}catch{setVideoError(true)}}else{video.current.pause();setPaused(true)}};
 const copy=async()=>{try{await navigator.clipboard.writeText('3189118462@qq.com');setCopyError(false);setCopied(true);setTimeout(()=>setCopied(false),2500)}catch{setCopyError(true)}};
 return <><div className="opening"><div className="opening-word" aria-hidden="true"><span>LI</span><span>JI</span><span>ZHONG.</span></div><div className="opening-line"/><div className="opening-meta" aria-hidden="true"><span>AI FILM / VISUAL / STORY</span><span>THE NEXT FRAME STARTS HERE.</span></div><button className="opening-skip">跳过开场 ↗</button></div><header className={navFloating ? 'nav nav-floating' : 'nav'}><a className="logo" href="#home" aria-label="回到首页">LI JIZHONG<span>↗</span><small>李继忠 · AI 影像创作</small></a><nav className={menu?'open':''}>{[['home','首页'],['about','关于我'],['work','精选作品'],['expertise','创作能力']].map(([id,label],i)=><a href={'#'+id} key={id} onClick={()=>setMenu(false)}><sup>0{i+1}</sup>{label}</a>)}</nav><a className="contact-link" href="#contact">聊聊合作 <ArrowUpRight size={16}/></a><button className="menu" aria-label="切换导航" onClick={()=>setMenu(!menu)}><Menu/></button></header>
 <main><section className="hero" id="home"><div className="hero-bg"/><video ref={video} className="hero-video" autoPlay muted loop playsInline onError={()=>setVideoError(true)} poster={img('photo-1464822759023-fed622ff2c3b')}><source src="/videos/hero.mp4" type="video/mp4"/></video><div className="hero-shade"/><div className="hero-content wrap"><div className="eyebrow"><span className="dot"/> LI JIZHONG / AI VISUAL CREATOR <span className="hero-year">PORTFOLIO — VOL.01</span></div><h1 aria-label="李继忠"><span className="hero-char" aria-hidden="true">李</span><span className="hero-char" aria-hidden="true">继</span><span className="hero-char" aria-hidden="true">忠</span></h1><div className="hero-bottom"><div><p className="hero-en">BEYOND IMAGINATION.<br/>INTO THE FRAME.</p><p className="hero-roles">AI 影视导演 <i/> AI 美术视觉 <i/> AI 分镜设计师</p></div><a className="round-link" href="#work"><span>探索我的作品<br/><small>EXPLORE WORK</small></span><ArrowDown size={25}/></a></div></div><div className="hero-foot wrap"><span>以技术拓展边界，以审美定义表达。</span><button onClick={toggleVideo} disabled={videoError} aria-label={paused?'播放背景视频':'暂停背景视频'}>{paused?<Play size={12}/>:<Pause size={12}/>} {videoError?'静态封面模式':paused?'PLAY FILM':'PAUSE FILM'}</button><span>SCROLL TO DISCOVER ↓</span></div></section>
 <section className="about wrap section" id="about"><div className="section-label"><span><span className="dot"/> ABOUT THE CREATOR</span><span>01 / 关于我</span></div><div className="chapter-title" aria-hidden="true"><span className="chapter-word">THE</span><span className="chapter-word">CREATOR</span></div><div className="about-grid"><div className="bio"><div className="micro">DIRECTOR. ARTIST. STORYTELLER.</div><h2>用新的工具，<br/>讲<span className="muted">值得被看见的故事。</span></h2><p className="bio-intro"><strong className="name">李继忠</strong><br/>关注 AI 影视导演、AI 美术视觉与分镜设计的影像创作者。</p><p>本科就读于安徽工业大学会计学专业。我将细心严谨、分析问题与持续学习的习惯带入影像创作，结合时下热点，运用 AI 图片生成、视频生成与剪辑工具探索视觉表达。已创作出获 4000+ 点赞、8 万观看的短视频。</p><div className="profile-info"><span>创作领域 <b>AI 影视 / 视觉 / 分镜</b></span><span>现居城市 <b>安徽省蚌埠市</b></span></div><div className="stats"><div><strong>4000<small> +</small></strong><span>短视频点赞</span></div><div><strong>8<small> 万</small></strong><span>短视频观看</span></div><div><strong>03</strong><span>核心创作方向</span></div></div><a className="text-link" href="#contact">建立联系 <ArrowUpRight size={18}/></a><small className="placeholder-note">创作成果数据来自个人简历。</small></div></div><div className="resume-facts"><article><div className="micro">EDUCATION / 教育背景</div><h3>安徽工业大学</h3><p>2022 — 2026 · 会计学 · 本科</p><small>相关课程：财务会计学、审计学、高级管理会计</small></article><article><div className="micro">QUALIFICATIONS / 证书与技能</div><h3>严谨思考，持续学习</h3><p>英语四级 CET-4 · 427 分 / 安徽省计算机二级</p><small>持机动车驾驶证；熟练使用 Word、Excel、PPT、飞书</small></article></div></section>
 <section className="work section wrap" id="work"><div className="section-label"><span><span className="dot"/> SELECTED WORK</span><span>02 / 精选作品</span></div><div className="chapter-title" aria-hidden="true"><span className="chapter-word">SELECTED</span><span className="chapter-word">WORK</span></div><div className="section-heading"><h2>让想象<span className="serif">显影。</span></h2><p>影像作品与创作实践。<br/>点击作品，观看完整视频。</p></div><div className="project-grid">{projects.map((p,i)=><button key={p.id} className={'project project-'+i} onClick={e=>{trigger.current=e.currentTarget;setActive(p)}}><div className="project-image"><div className="project-parallax"><img className="project-preview" src={p.poster} alt="《创伤》作品画面" loading="lazy"/></div><span className="project-tag">{p.type}</span><span className="project-open"><Play/></span><span className="image-title">{p.en}</span><span className="concept-label">点击观看完整作品 ↗</span></div><div className="project-caption"><div><small>{p.id} / {p.year}</small><h3>{p.title}</h3></div><span>{p.en}<ArrowUpRight size={17}/></span></div></button>)}</div><div className="work-note">FILM COLLECTION <span>《创伤》 · 完整版展映</span><span>点击作品播放 / 支持全屏观看</span></div></section>
 <section className="expertise section" id="expertise"><div className="wrap"><div className="section-label"><span><span className="dot"/> WHAT I BRING</span><span>03 / 个人优势</span></div><div className="chapter-title" aria-hidden="true"><span className="chapter-word">WHAT I</span><span className="chapter-word">BRING</span></div><div className="section-heading"><h2>技术是工具。<br/><span className="muted">表达，才是目的。</span></h2><p>AI 生成工具与后期剪辑相结合，<br/>从热点洞察走向影像表达。</p></div><div className="abilities">{abilities.map(([n,title,role,desc,en])=><article key={n}><div className="ability-top"><span>/{n}</span><Plus size={22}/></div><h3>{title}</h3><h4>{role}</h4><p>{desc}</p><small>{en}</small></article>)}</div><div className="workflow"><span>MY CREATIVE PROCESS</span>{['热点洞察','剧本分镜','AI 生成','剪辑呈现'].map((v,i)=><React.Fragment key={v}><b><small>0{i+1}</small>{v}</b>{i<3&&<ArrowRight size={16}/>}</React.Fragment>)}</div></div></section>
 <section className="contact section" id="contact"><div className="wrap"><div className="section-label"><span><span className="dot"/> NEXT FRAME, TOGETHER</span><span>04 / 联系合作</span></div><div className="chapter-title" aria-hidden="true"><span className="chapter-word">LET’S</span><span className="chapter-word">CREATE</span></div><p className="contact-intro">好的故事，从一次对话开始。</p><h2>下一个画面，<br/><span>一起创造。</span><ArrowUpRight className="contact-arrow"/></h2><div className="contact-row"><p>如果你有一个想法、一个故事，<br/>或只是想聊聊 AI 影像的可能性。</p><a className="contact-cta" href="mailto:3189118462@qq.com">LET’S TALK <ArrowUpRight size={22}/></a></div><div id="contact-details" className="contact-details"><div><small>EMAIL / 邮箱</small><a href="mailto:3189118462@qq.com">3189118462@qq.com</a></div><div><small>PHONE / 电话</small><a href="tel:+8615155223630">151 5522 3630</a></div><button onClick={copy}>{copied?<Check size={17}/>:<Copy size={17}/>} {copied?'邮箱已复制':copyError?'复制失败，请选择邮箱复制':'复制邮箱'}</button></div><footer><a className="logo" href="#home">LI JIZHONG<span>↗</span></a><span>© {new Date().getFullYear()} 李继忠 · AI 影像作品集</span><a href="#home">BACK TO TOP ↑</a></footer></div></section></main>
 {active&&<div className="modal-backdrop" onClick={()=>setActive(null)}><article className="modal" role="dialog" aria-modal="true" aria-labelledby="project-title" onClick={e=>e.stopPropagation()}><button ref={closeButton} className="modal-close" onClick={()=>setActive(null)} aria-label="关闭项目详情"><X/></button><FilmPlayer src={active.video} title={active.title} poster={active.poster}/><div className="modal-body"><span className="micro">{active.type} / 创作成果</span><h2 id="project-title">{active.title}</h2><p>{active.desc}</p><p className="muted">{active.role}</p></div></article></div>}
 </>;
}
createRoot(document.getElementById('root')).render(<App/>);
