
### A slider component in [solidjs.com](https://solidjs.com)

#### PART TWO

The first version of the slider had various problems and should not be used to learn SolidJS. Since i'am also just learning SolidJS, i didn't notice the problems with the Slider in my app, but there are problems with the reactive props. Also some problems with the `step`, `offset` and `value` props. I should have tested the component better before writing a tutorial about SolidJS. I apologize. &#x273B;

#### Here you find an updated verison of the slider:

- The props are now initialized in every function when needed. This makes the component props reactive with Signals.
- There were problems with the value calculation, and resize handling
- Renamed `minValue` and `maxValue` to `min` and `max`, `onChangeEnd` to `onEnd` and added a `onStart` callback function
- I also added a global `index.css` file for styling and changed some of the style sheets

```css
body {
	background: #CFCFCF;
}
body, div, button, p, span {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
.main {
	margin: 32px;
	padding: 16px;
	border-radius: 12px;
	background: #F2F2F2;
	color: #222;
}

.slider_label {
	display: block;
	padding: 12px 4px;
}

.output {
    font-size: 16px;
    color: inherit;
    text-align: right;
    margin: 12px;
}

.demo_slider_wrap {
	background-color: #ada;
	border-radius: 12px;
	padding: 24px;
	margin: 16px;
}

.demo_slider {
	margin-bottom: 32px;
}
.demo_slider .ui_slider_track {
	background: #ccffcc;
	border: 2px solid #141;
	border-radius: 16px;
	height: 38px;
	padding: 0px;
}
.demo_slider .ui_slider_button {
	background: #252;
	width: 20px;
	height: 28px;
	top: 5px;
	border-radius: 14px;
}

@media (prefers-color-scheme: dark) {
	body {
		background: #181818;
	}
	.main {
		background: #212121;
		color: #DDD;
	}
	.demo_slider_wrap {
		background-color: #224422;
	}
	.demo_slider .ui_slider_track {
		background: #020;
	}
}
```

The styles react to the operating system dark mode settings. IF you don't want this, remove the `@media` block.
Here are some general styles and also a unique styling for the demo slider: `demo_slider`. The css class name is then used as a component prop later.

I created a new example project with a lot of Sliders to test the features

```jsx
import { createSignal } from "solid-js";
import Slider from "./components/Slider";
import "./index.css";

function App() {
  const [sliderValue, setSliderValue] = createSignal(50);
  const [slider2Value, setSlider2Value] = createSignal(50);
  const [sliderMinValue, setSliderMinValue] = createSignal(0);
  const [sliderMaxValue, setSliderMaxValue] = createSignal(100);
  const [sliderOffsetValue, setSliderOffsetValue] = createSignal(0);
  const [sliderStepValue, setSliderStepValue] = createSignal(0);
  let theSlider, linkSlider, minSlider, maxSlider, offsetSlider, stepSlider;

  function sliderChange (val, track, btn) {
      setSliderValue(val.value);
  }
  function sliderStart (val, track, btn) {
      console.log("Slider clicked at " + val.value);
  }
  function sliderEnd (val, track, btn) {
      console.log("Slider released at " + val.value);
  }
  function slider2Change (val, track, btn) {
      setSlider2Value(val.value);
  }
  function sliderMinChange (val, track, btn) {
     setSliderMinValue(val.value);
  }
  function sliderMaxChange (val, track, btn) {
     setSliderMaxValue(val.value);
  }
  function sliderOffsetChange (val, track, btn) {
     setSliderOffsetValue(val.value);
  }
  function sliderStepChange (val, track, btn) {
     setSliderStepValue(val.value);
  }
  const setButtonValue = () => {
      setSliderValue(43);
  }

  return (
    <div class="main">
        <h2>SolidJS Slider Component</h2>

        <label class="slider_label">Min:</label>
        <Slider ref={minSlider}
                defaultValue={sliderMinValue()}
                min={250}
                max={-250}
                step={10}
                onChange={sliderMinChange}
        />
        <p class="output">{sliderMinValue()}</p>

        <label class="slider_label">Max:</label>
        <Slider ref={maxSlider}
                defaultValue={sliderMaxValue()}
                min={-250}
                max={250}
                step={10}
                onChange={sliderMaxChange}
        />
        <p class="output">{sliderMaxValue()}</p>

        <label class="slider_label">Offset:</label>
        <Slider ref={offsetSlider}
                defaultValue={sliderOffsetValue()}
                min={0}
                max={25}
                step={1}
                onChange={sliderOffsetChange}
        />
        <p class="output">{sliderOffsetValue()}</p>

        <label class="slider_label">Step:</label>
        <Slider ref={stepSlider}
                defaultValue={sliderStepValue()}
                min={0}
                max={25}
                step={1}
                onChange={sliderStepChange}
        />
        <p class="output">{sliderStepValue()}</p>

        <div class="demo_slider_wrap">
            <label class="slider_label">Demo Slider:</label>
            <Slider ref={theSlider}
                    cssClass="demo_slider"
                    defaultValue={sliderValue()}
                    min={sliderMinValue()}
                    max={sliderMaxValue()}
                    offset={sliderOffsetValue()}
                    step={sliderStepValue()}
                    onChange={sliderChange}
                    onStart={sliderStart} 
                    onEnd={sliderEnd} 
            />
            <p class="output">{sliderValue().toFixed(4)}</p>
          </div>

        <label class="slider_label">Linked Slider:</label>
        <Slider ref={linkSlider}
                min={sliderMinValue()}
                max={sliderMaxValue()}
                offset={sliderOffsetValue()}
                step={sliderStepValue()}
                value={sliderValue()}
                onChange={slider2Change}
        />
        <p class="output">{slider2Value().toFixed(4)}</p>
        <button onClick={setButtonValue}>Set Slider Value To 43</button>
    </div>
  )
}

export default App;

```

Here are a few Sliders wich control the Demo Slider.

`components/slider.css`
```css
.ui_slider {
    width: 100%;
    height: 18px;
    position: relative;
}

.ui_slider_track {
    background: #EEE;
    border: 1px solid #AAA;
    height: 20px;
    width: 100%;
    border-radius: 10px;
    padding: 0px;
}

.ui_slider_button {
    outline: none;
    border: none;
    background-color: #44F;
    display: block;
    position: absolute;
    left: 0px;
    top: 2px;
    height: 16px;
    width: 48px;
    border-radius: 8px;
    font-size: 8px;
}

@media (prefers-color-scheme: dark) {
    .ui_slider_track {
        background: #282828;
        border: 1px solid #1c1c1c;
    }
}
```

And `components/Slider.jsx`
```jsx
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
            props.onEnd(sliderPos.value, track, btn);
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
            <button ref={btn} class="ui_slider_button" onMouseDown={sliderDown}></button>
        </div>
    );
}
export default Slider;
```

A lot has changed here, a createEffect handles to reactive `value` prop wich controlls the Slider position when set to a Signal. Note, the `Min` and `Max` Sliders have the `min` and `max` properties inverted. 

There are still some problems with the `value`. Sometimes it is something like `10.000000012999` but this can be fixed with `Math.round` or `Number.toFixed` when the value is used or displayed. I wanted to see the internal value wich are set on the Demo Slider.
