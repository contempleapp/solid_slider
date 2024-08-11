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
