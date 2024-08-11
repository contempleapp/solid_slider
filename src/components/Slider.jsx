import { onMount, onCleanup } from "solid-js";
import "./slider.css";
/**
 * Props:
 * defaultValue: Number
 * minValue: Number
 * maxValue: Number
 * step: Number
 * offset: Number
 * onChange: Function
 * onChangeEnd: Function
 */
function Slider (props) {
    const min = parseFloat(props.minValue || 0);
    const max = parseFloat(props.maxValue || 100);
    const step = parseFloat(props.step || 1);
    const offset = parseFloat(props.offset || 0);
    const onChange = props.onChange || null;
    const onChangeEnd = props.onChangeEnd || null;
    const sliderPos = { clickPos: 0, btnStartPos: 0, currValue: 0 };
    let btn, track;

    onMount(() => {
        const size = (track.clientWidth - btn.clientWidth) - offset * 2;
        const percent = getPercentValue(props.defaultValue || 0);
        sliderPos.currValue = props.defaultValue || 0;
        btn.style.left = (size * percent + offset) + "px";
        window.addEventListener("resize", windowResize);
    });

    onCleanup(() => {
        window.removeEventListener("resize", windowResize);
    });

    function windowResize (e) {
        const size = (track.clientWidth - btn.clientWidth) - offset * 2;
        const percent = getPercentValue(sliderPos.currValue);
        btn.style.left = (size * percent + offset) + "px";
    }

    function getPercentValue (v) {
        let val = parseFloat(v);
        let p, percent;
        if( max > min) {
            if(val < min) val = min;
            else if(val > max) val = max;
            p = val - min;
            percent = p/(max-min);
        }else{
            if(val < max) val = max;
            else if(val > min) val = min;
            p = val - max;
            percent = 1-(p/(min-max));
        }
        return percent;
    }

    function getBtnPercentValue (btn_pos) {
        const size = (track.clientWidth - btn.clientWidth) - offset * 2;
        return (btn_pos - offset)/size;
    }

    function sliderUp (event) {
        window.document.removeEventListener("mouseup", sliderUp);
        window.document.removeEventListener("mousemove", sliderMove);
        if(typeof onChangeEnd === "function") {
            const pos = parseFloat(btn.style.left);
            const percent = getBtnPercentValue(pos);
            const newval = min + (max - min) * percent;
            onChangeEnd(newval, track, btn);
        }
    }

    function sliderMove (event) {
        const dx = Number(event.clientX) - sliderPos.clickPos;
        let pos = Math.round(dx) + sliderPos.btnStartPos;
        
        if(pos < offset) pos = offset;
        else if(pos > track.clientWidth - (btn.clientWidth + offset)) 
            pos = track.clientWidth - (btn.clientWidth + offset);
        
        if(step !== 1) {
            const vs = (track.clientWidth-(btn.clientWidth + offset)) / max * step;
            pos = Math.round(pos / vs ) * vs;
        }

        btn.style.left = pos + "px";

        if(typeof onChange === "function") {
            const percent = getBtnPercentValue(pos);
            const newval = min + (max - min) * percent;
            sliderPos.currValue = newval;
            onChange(newval, track, btn);
        }
    }

    function sliderDown (event) {
        window.document.addEventListener("mouseup", sliderUp);
        window.document.addEventListener("mousemove", sliderMove);
        sliderPos.clickPos = Number(event.clientX);
        sliderPos.btnStartPos = parseInt(btn.style.left) || 0;
    }

    return (
        <div class={"ui_slider" + (props.cssClass ? " " + props.cssClass : "")}>
            <div ref={track} class="ui_slider_track"></div>
            <button ref={btn} class="ui_slider_button" onMouseDown={sliderDown}></button>
        </div>
    );
}
export default Slider;