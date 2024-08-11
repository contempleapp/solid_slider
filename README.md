### A slider component in [solidjs.com](https://solidjs.com)

There are a lot of good ui libraries for solidjs like [kobalte.dev](https://kobalte.dev), [suid.io](https://suid.io) or [ark-ui.com](https://ark-ui.com). There are some very advanced Sliders, but i want to write a few ui components for my [tauri.app](https://tauri.app) app and a Slider is a needed base component for other components like a Color Picker component etc.

# Let's get started with a new SolidJS project

Open Terminal app and run

```
npm create vite@latest
```

The command will ask some questions, select Solid from the list using the cursor keys, Typescript is not required for this project, select Javascript

Still in the Terminal, change the directory to the new folder created:
```
cd my-ui-library
```

Inside the directory run the install command to setup the vite project:
```
npm install
```

Create a `components` folder inside the `src` directory:

In the components directory, create two files: `slider.css` and `Slider.jsx`.

`components/slider.css`:
```css
.ui_slider {
    width: 100%;
    height: 24px;
    position: relative;
}

.output {
    font-size: 16px;
    color: #333;
    text-align: right;
    margin-right: 12px;
}

.ui_slider_track {
    box-sizing: border-box;
    background: #dfdfdf;
    border: 1px solid #666;
    height: 18px;
    width: 100%;
    border-radius: 9px;
    padding: 2px;
}

.ui_slider_button {
    box-sizing: border-box;
    outline: none;
    border: none;
    background-color: #44F;
    display: block;
    position: absolute;
    left: 2px;
    top: 2px;
    height: 14px;
    font-size: 8px;
    width: 32px;
    border-radius: 6px;
}

@media (prefers-color-scheme: dark) {
    .ui_slider p {
        color: #DDD;
    }
    .ui_slider_track {
        background: #222;
        border: 1px solid #1c1c1c;
    }
}
```

The slider is either light or dark, depending on the setting of the operating system. I also prefixed all class names with `ui_` to avoid css naming conflicts.

`components/Slider.jsx`

```jsx
import { onMount } from "solid-js";
import "./slider.css";
/**
 * Props:
 * defaultValue: Number
 * minValue: Number
 * maxValue: Number
 * step: Number
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
    const sliderPos = { clickPos: 0, btnStartPos: 0 };
    let btn, track;

    onMount(() => {
        const size = (track.clientWidth - btn.clientWidth) - offset * 2;
        const percent = getPercentValue(props.defaultValue || 0);
        btn.style.left = (size * percent + offset) + "px";
    });

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
```

This is the jsx code for the Slider component. At the beginning, we initialize the correct data types from the props object.

`onMount` is called once, when the component was created, here we can get the current size of the Slider and initialize the button position. The next function calculates the value from the button position. `getPercentValue` returns the current value in percent (0-1). The `getBtnPercentValue` returns the percent value of the button relative to the slider track.

In the `sliderMove` function, the value is calculated from the current button position, and the button.style.top css property is updated when the mouse moves. The `sliderDown` and `sliderUp` handle the creation and removing of the Mouse Event Listeners.

Finally, the Slider is used inside the App.jsx file:

`App.jsx`:
```jsx
import { createSignal } from "solid-js";
import Slider from "./components/Slider";

function App() {
  const [sliderValue, setSliderValue] = createSignal(0);

  function sliderChange (val, track, btn) {
      setSliderValue(val);
  }
  function sliderChangeEnd (val, track, btn) {
      console.log("Slider released at " + val);
  }

  return (
    <div class="main">
        <h2>SolidJS Slider Component</h2>
        <Slider minValue={0}
                maxValue={100}
                offset={2}
                step={1}
                onChange={sliderChange}
                onChangeEnd={sliderChangeEnd} 
        />
        <p class="output">{sliderValue().toFixed(2)}</p>
    </div>
  )
}

export default App;
```

Finally remove the default demo styles from the index.jsx file:

```jsx
/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'

const root = document.getElementById('root')
render(() => <App />, root)
``` 

To run the example:
```
npm run dev
```

Open a web browser and navigate to the url from the Terminal output: http://localhost:5173

The page background color and default page styles like box-sizing are missing in this example. Also when the browser is resized, the button position of the slider should be updated.

