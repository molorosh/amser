import{b as ne,d as te,i as oe,q as ie,r as f,s as ce,t as M}from"./chunk-U626PCKM.js";import{Da as Y,Ea as B,Ka as ee,g as K,i as X,k as U,la as J,m as Z,ma as W}from"./chunk-E2LK7G5L.js";import{$a as a,Bb as j,Cb as p,H as S,Ha as u,I as N,Ia as A,J as D,L as z,La as P,Lb as H,Ma as b,N as g,Na as x,Pb as R,U as s,Ua as h,Z as C,_b as q,ab as w,bb as T,ca as L,cb as v,cc as F,fb as _,ga as l,gb as V,hb as E,jc as m,kc as G,nb as O,pb as k,sb as $,tb as Q,ua as d,ub as y,vb as I}from"./chunk-S3JMPENE.js";var ue=["data-p-icon","check"],re=(()=>{class e extends M{static \u0275fac=(()=>{let n;return function(t){return(n||(n=l(e)))(t||e)}})();static \u0275cmp=u({type:e,selectors:[["","data-p-icon","check"]],features:[b],attrs:ue,decls:1,vars:0,consts:[["d","M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z","fill","currentColor"]],template:function(o,t){o&1&&(s(),_(0,"path",0))},encapsulation:2})}return e})();var be=["data-p-icon","minus"],de=(()=>{class e extends M{static \u0275fac=(()=>{let n;return function(t){return(n||(n=l(e)))(t||e)}})();static \u0275cmp=u({type:e,selectors:[["","data-p-icon","minus"]],features:[b],attrs:be,decls:1,vars:0,consts:[["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(o,t){o&1&&(s(),_(0,"path",0))},encapsulation:2})}return e})();var se=`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;var ke=["icon"],xe=["input"],me=(e,r,n)=>({checked:e,class:r,dataP:n});function fe(e,r){if(e&1&&v(0,"span",8),e&2){let n=k(3);p(n.cx("icon")),a("ngClass",n.checkboxIcon)("pBind",n.ptm("icon")),h("data-p",n.dataP)}}function ge(e,r){if(e&1&&(s(),v(0,"svg",9)),e&2){let n=k(3);p(n.cx("icon")),a("pBind",n.ptm("icon")),h("data-p",n.dataP)}}function Ce(e,r){if(e&1&&(V(0),x(1,fe,1,5,"span",6)(2,ge,1,4,"svg",7),E()),e&2){let n=k(2);d(),a("ngIf",n.checkboxIcon),d(),a("ngIf",!n.checkboxIcon)}}function ve(e,r){if(e&1&&(s(),v(0,"svg",10)),e&2){let n=k(2);p(n.cx("icon")),a("pBind",n.ptm("icon")),h("data-p",n.dataP)}}function _e(e,r){if(e&1&&(V(0),x(1,Ce,3,2,"ng-container",3)(2,ve,1,4,"svg",5),E()),e&2){let n=k();d(),a("ngIf",n.checked),d(),a("ngIf",n._indeterminate())}}function ye(e,r){}function Ie(e,r){e&1&&x(0,ye,0,0,"ng-template")}var Be=`
    ${se}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,Me={root:({instance:e})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":e.checked,"p-disabled":e.$disabled(),"p-invalid":e.invalid(),"p-variant-filled":e.$variant()==="filled","p-checkbox-sm p-inputfield-sm":e.size()==="small","p-checkbox-lg p-inputfield-lg":e.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},le=(()=>{class e extends ee{name="checkbox";style=Be;classes=Me;static \u0275fac=(()=>{let n;return function(t){return(n||(n=l(e)))(t||e)}})();static \u0275prov=N({token:e,factory:e.\u0275fac})}return e})();var he=new z("CHECKBOX_INSTANCE"),we={provide:ne,useExisting:S(()=>pe),multi:!0},pe=(()=>{class e extends ie{componentName="Checkbox";hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=F();size=F();onChange=new C;onFocus=new C;onBlur=new C;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:W(this.value,this.modelValue())}_indeterminate=L(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=g(le);bindDirectiveInstance=g(f,{self:!0});$pcCheckbox=g(he,{optional:!0,skipSelf:!0})??void 0;$variant=q(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(n=>{switch(n.getType()){case"icon":this._checkboxIconTemplate=n.template;break;case"checkboxicon":this._checkboxIconTemplate=n.template;break}})}onChanges(n){n.indeterminate&&this._indeterminate.set(n.indeterminate.currentValue)}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}updateModel(n){let o,t=this.injector.get(te,null,{optional:!0,self:!0}),i=t&&!this.formControl?t.value:this.modelValue();this.binary?(o=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(o),this.onModelChange(o)):(this.checked||this._indeterminate()?o=i.filter(c=>!J(c,this.value)):o=i?[...i,this.value]:[this.value],this.onModelChange(o),this.writeModelValue(o),this.formControl&&this.formControl.setValue(o)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:o,originalEvent:n})}handleChange(n){this.readonly||this.updateModel(n)}onInputFocus(n){this.focused=!0,this.onFocus.emit(n)}onInputBlur(n){this.focused=!1,this.onBlur.emit(n),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(n,o){o(n),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let n;return function(t){return(n||(n=l(e)))(t||e)}})();static \u0275cmp=u({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(o,t,i){if(o&1&&$(i,ke,4)(i,Y,4),o&2){let c;y(c=I())&&(t.checkboxIconTemplate=c.first),y(c=I())&&(t.templates=c)}},viewQuery:function(o,t){if(o&1&&Q(xe,5),o&2){let i;y(i=I())&&(t.inputViewChild=i.first)}},hostVars:6,hostBindings:function(o,t){o&2&&(h("data-p-highlight",t.checked)("data-p-checked",t.checked)("data-p-disabled",t.$disabled())("data-p",t.dataP),p(t.cn(t.cx("root"),t.styleClass)))},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",m],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",G],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",m],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",m],autofocus:[2,"autofocus","autofocus",m],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[H([we,le,{provide:he,useExisting:e},{provide:oe,useExisting:e}]),P([f]),b],decls:5,vars:26,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(o,t){o&1&&(w(0,"input",1,0),O("focus",function(c){return t.onInputFocus(c)})("blur",function(c){return t.onInputBlur(c)})("change",function(c){return t.handleChange(c)}),T(),w(2,"div",2),x(3,_e,3,2,"ng-container",3)(4,Ie,1,0,null,4),T()),o&2&&(j(t.inputStyle),p(t.cn(t.cx("input"),t.inputClass)),a("checked",t.checked)("pBind",t.ptm("input")),h("id",t.inputId)("value",t.value)("name",t.name())("tabindex",t.tabindex)("required",t.required()?"":void 0)("readonly",t.readonly?"":void 0)("disabled",t.$disabled()?"":void 0)("aria-labelledby",t.ariaLabelledBy)("aria-label",t.ariaLabel),d(2),p(t.cx("box")),a("pBind",t.ptm("box")),h("data-p",t.dataP),d(),a("ngIf",!t.checkboxIconTemplate&&!t._checkboxIconTemplate),d(),a("ngTemplateOutlet",t.checkboxIconTemplate||t._checkboxIconTemplate)("ngTemplateOutletContext",R(22,me,t.checked,t.cx("icon"),t.dataP)))},dependencies:[Z,K,X,U,B,re,de,ce,f],encapsulation:2,changeDetection:0})}return e})(),on=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=A({type:e});static \u0275inj=D({imports:[pe,B,B]})}return e})();export{re as a,pe as b,on as c};
