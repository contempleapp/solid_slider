import { createSignal } from "solid-js";
import Slider from "./components/Slider";
import "./index.css";

function App() {
  const [sliderValue, setSliderValue] = createSignal(50);
  const [slider2Value, setSlider2Value] = createSignal(50);
  const [sliderMinValue, setSliderMinValue] = createSignal(0);
  const [sliderMaxValue, setSliderMaxValue] = createSignal(100);
  const [sliderOffsetValue, setSliderOffsetValue] = createSignal(0);
  const [sliderStepValue, setSliderStepValue] = createSignal(1);
  let demoSlider, linkSlider, minSlider, maxSlider, offsetSlider, stepSlider;

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
  function setButtonValue () {
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
                onChange={(val) => setSliderMinValue(val.value)}
        />
        <p class="output">{sliderMinValue()}</p>

        <label class="slider_label">Max:</label>
        <Slider ref={maxSlider}
                defaultValue={sliderMaxValue()}
                min={-250}
                max={250}
                step={10}
                onChange={(val) => setSliderMaxValue(val.value)}
        />
        <p class="output">{sliderMaxValue()}</p>

        <label class="slider_label">Offset:</label>
        <Slider ref={offsetSlider}
                defaultValue={sliderOffsetValue()}
                min={0}
                max={50}
                step={1}
                onChange={(val) => setSliderOffsetValue(val.value)}
        />
        <p class="output">{sliderOffsetValue()}</p>

        <label class="slider_label">Step:</label>
        <Slider ref={stepSlider}
                defaultValue={sliderStepValue()}
                min={0}
                max={2.5}
                step={0.001}
                onChange={(val) => setSliderStepValue(val.value)}
        />
        <p class="output">{sliderStepValue()}</p>

        <div class="demo_slider_wrap">
            <label class="slider_label">Demo Slider:</label>
            <Slider ref={demoSlider}
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
            <p class="output">{sliderValue()}</p>
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
