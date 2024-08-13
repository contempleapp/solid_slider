import { onMount, onCleanup, createEffect } from "solid-js";
import "./slider.css";
/** 
 * Props:
 * cssClass: String
 * defaultValue: Number
 * min Number
 * max: Number
 * step: Number
 * offset: Number
 * kbdStep: Number
 * value: Number
 * onChange: Function( currentValue, track_ref, button_ref)
 * onStart: Function( currentValue, track_ref, button_ref )
 * onEnd: Function( currentValue, track_ref, button_ref )
 * *** Note: currentValue is an object with the 'value' property
 */
function Slider (props) {
    const sliderPos = { clickPos: 0, btnStartPos: 0, value: 0 };
    let btn, track;

    onMount(() => {
        const offset = props.offset || 0;
        const size = track.clientWidth - (btn.clientWidth + (offset * 2));
        const percent = getPercentValue(props.defaultValue || 0);
        sliderPos.value = props.defaultValue || 0;
        btn.style.left = ((size * percent) + offset) + "px";
        window.addEventListener("resize", resize);
    });
    onCleanup(() => window.removeEventListener("resize", resize));

    createEffect(() => {
        if(typeof props.value !== "undefined" && props.value !== sliderPos.value) {
            updateValue(props.value);
        }
    });

    function resize (e) {
        const offset = props.offset || 0;
        const size = track.clientWidth - (btn.clientWidth + (offset * 2));
        const percent = getPercentValue(sliderPos.value);
        btn.style.left = (size * percent + offset) + "px";
    }

    function getPercentValue (v) {
        const min = props.min || 0;
        const max = typeof props.max == "number" ? props.max : 100;
        const val = inRange(min, max, parseFloat(v));
        if(max > min) return (val-min)/(max-min);
        else return 1 - ((val-max) / (min-max));
    }

    function getBtnPercentValue (btn_pos) {
        const offset = props.offset || 0;
        const size = track.clientWidth - (btn.clientWidth + (offset * 2));
        return (btn_pos - offset) / size;
    }

    function sliderUp (event) {
        window.removeEventListener("mouseup", sliderUp);
        window.removeEventListener("mousemove", sliderMove);
        if(typeof props.onEnd === "function") 
            props.onEnd(sliderPos, track, btn);
    }

    function sliderMove (event) {
        const dx = Number(event.clientX) - sliderPos.clickPos;
        const step = props.step || 0;
        const offset = props.offset || 0;
        const min = props.min || 0;
        const max = typeof props.max == "number" ? props.max : 100;
        const size = track.clientWidth - (btn.clientWidth + (offset * 2));
        let pos = Math.round(dx) + sliderPos.btnStartPos;
        
        if(pos < offset) pos = offset;
        else if(pos > size + offset) pos = size + offset;
        else if(step !== 0) {
            const vs = (size/ (max - min)) * step;
            pos = Math.round((pos - offset*2) / vs) * vs + offset;
            if(pos < offset) pos = offset;
            else if(pos > size + offset) pos = size + offset;
        }

        btn.style.left = pos + "px";

        const percent = getBtnPercentValue(pos);
        const newval = (max - min) * percent + min;
        sliderPos.value = newval;
        
        if(typeof props.onChange === "function") 
            props.onChange(sliderPos, track, btn);
    }

    function sliderDown (event) {
        window.addEventListener("mouseup", sliderUp);
        window.addEventListener("mousemove", sliderMove);
        sliderPos.clickPos = Number(event.clientX);
        sliderPos.btnStartPos = parseInt(btn.style.left) || 0;
        if(typeof props.onStart === "function") 
            props.onStart(sliderPos, track, btn);
    }
    
    function kbdDown (event) {
        if(event.key === "ArrowLeft") 
            updateValue( sliderPos.value - (typeof props.kbdStep === "number" ? props.kbdStep : 1));
        else if(event.key === "ArrowRight") 
            updateValue( sliderPos.value + (typeof props.kbdStep === "number" ? props.kbdStep : 1) );
    }

    function updateValue (val) {
        const min = props.min || 0;
        const max = typeof props.max == "number" ? props.max : 100;
        const offset = typeof props.offset === "number" ? props.offset : 0;
        val = inRange(min, max, val)
        const size = track.clientWidth - (btn.clientWidth + (offset * 2));
        const percent = getPercentValue(val);
        sliderPos.value = val;
        btn.style.left = (size * percent + offset) + "px";
        if(typeof props.onChange === "function")
            props.onChange(sliderPos, track, btn);
    }

    function inRange (min, max, val) {
        if( max > min) {
            if(val < min) val = min;
            else if(val > max) val = max;
        }else{
            if(val < max) val = max;
            else if(val > min) val = min;
        }
        return val;
    }

    return (
        <div class={"ui_slider" + (props.cssClass ? " " + props.cssClass : "")}>
            <div ref={track} class="ui_slider_track"></div>
            <button ref={btn} class="ui_slider_button" onMouseDown={sliderDown} onKeyDown={kbdDown}></button>
        </div>
    );
}
export default Slider;
