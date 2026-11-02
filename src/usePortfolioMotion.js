import {useLayoutEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePortfolioMotion(){
 useLayoutEffect(()=>{
  const media=gsap.matchMedia();
  let refreshFrame;
  let disposed=false;
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const intro=document.querySelector('.opening');
   const skip=document.querySelector('.opening-skip');
   const playOpening=window.scrollY<40&&!window.location.hash;
   let opening;
   const finish=()=>opening?.progress(1);
   const onScroll=()=>{if(window.scrollY>80)finish();};
   if(playOpening){
    gsap.set(intro,{display:'flex'});
    opening=gsap.timeline({defaults:{ease:'power4.inOut'},onComplete:()=>{
     gsap.set(intro,{display:'none'});
     gsap.set('.hero h1 .hero-char,.hero-video',{clearProps:'transform,willChange'});
     if(document.activeElement===skip)document.querySelector('.nav .logo')?.focus();
    }});
    opening.fromTo('.opening-word span',{yPercent:125,scaleY:1.5},{yPercent:0,scaleY:1,duration:1.15,stagger:.08,ease:'expo.out'},0)
     .fromTo('.opening-line',{scaleX:0},{scaleX:1,duration:1.15},.12)
     .to('.opening-word span',{yPercent:-130,duration:.75,stagger:.06},.85)
     .to(intro,{yPercent:-102,duration:1.65},1)
     .fromTo('.hero-video',{scale:1.12},{scale:1,duration:2.3,ease:'power3.out'},.9)
     .fromTo('.hero h1 .hero-char',{yPercent:125,scaleX:.65,scaleY:1.35,rotation:5,willChange:'transform'},{yPercent:0,scaleX:1,scaleY:1,rotation:0,duration:1.9,stagger:.14,ease:'expo.out'},1.35)
     .fromTo('.hero .eyebrow',{y:35,clipPath:'inset(0 0 100% 0)'},{y:0,clipPath:'inset(0 0 0% 0)',duration:1.2},1.8)
     .fromTo('.hero-bottom > *',{y:65,clipPath:'inset(0 0 100% 0)'},{y:0,clipPath:'inset(0 0 0% 0)',duration:1.4,stagger:.16},2)
     .fromTo('.nav > *,.hero-foot',{y:-20,autoAlpha:0},{y:0,autoAlpha:1,duration:1,stagger:.06,clearProps:'transform,opacity,visibility'},2.35);
    skip.addEventListener('click',finish);
    window.addEventListener('scroll',onScroll,{passive:true});
   }

   // Each title opens its own chapter. No scroll locking or scroll hijacking.
   gsap.utils.toArray('.chapter-title').forEach((title,index)=>{
    const words=title.querySelectorAll('.chapter-word');
    gsap.fromTo(words,{xPercent:index%2?-32:32,yPercent:115,rotation:4,scaleX:.8},{
     xPercent:0,yPercent:0,rotation:0,scaleX:1,duration:1.85,stagger:.13,ease:'expo.out',
     scrollTrigger:{trigger:title,start:'top 88%',once:true},clearProps:'transform'
    });
   });
   const reveal=(elements,trigger,delay=0)=>{
    const items=gsap.utils.toArray(elements);
    if(!items.length)return;
    gsap.fromTo(items,{y:85,rotation:1.5,clipPath:'inset(0 0 100% 0)'},{
     y:0,rotation:0,clipPath:'inset(0 0 0% 0)',duration:1.5,stagger:.18,delay,ease:'power4.out',
     clearProps:'transform,clipPath',scrollTrigger:{trigger,start:'top 87%',once:true}
    });
   };
   reveal('.bio > .micro,.bio h2,.bio-intro,.bio > p:not(.bio-intro),.profile-info','.about-grid',.2);
   reveal('.stats > div','.stats');
   reveal('.resume-facts article','.resume-facts');
   reveal('.work .section-heading > *','.work .section-heading',.15);
   gsap.utils.toArray('.project').forEach(card=>{
    const tl=gsap.timeline({delay:.4,scrollTrigger:{trigger:card,start:'top 88%',once:true}});
    tl.fromTo(card.querySelector('.project-image'),{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.8,ease:'power4.inOut',clearProps:'clipPath'})
     .fromTo(card.querySelectorAll('.project-caption > *'),{y:50,clipPath:'inset(0 0 100% 0)'},{y:0,clipPath:'inset(0 0 0% 0)',duration:1.2,stagger:.18,ease:'power4.out',clearProps:'transform,clipPath'},.9);
   });
   reveal('.expertise .section-heading > *','.expertise .section-heading',.15);
   reveal('.abilities article','.abilities',.45);
   reveal('.workflow > *','.workflow');
   reveal('.contact-intro,.contact h2','.contact-intro',.15);
   reveal('.contact-row > *','.contact-row');
   reveal('.contact-details > *','.contact-details');
   media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)',()=>{
    gsap.utils.toArray('.project-parallax').forEach(image=>{
     gsap.fromTo(image,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:image.parentElement,start:'top bottom',end:'bottom top',scrub:1.2}});
    });
   });
   return()=>{
    skip?.removeEventListener('click',finish);
    window.removeEventListener('scroll',onScroll);
   };
  });
  const refresh=()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());};
  document.fonts?.ready.then(()=>{if(!disposed)refresh();});
  window.addEventListener('load',refresh);
  return()=>{disposed=true;cancelAnimationFrame(refreshFrame);window.removeEventListener('load',refresh);media.revert();};
 },[]);
}
