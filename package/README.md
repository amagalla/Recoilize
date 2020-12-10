<meta name='keywords' content='Recoil, Recoil.js, Recoil Dev Tool, Recoilize, Chrome Dev Tool, Recoil Chrome'>

<h1>Debugger for Recoil Applications</h1>

# [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/oslabs-beta/Recoilize/blob/staging/LICENSE) [![npm version](https://img.shields.io/npm/v/recoilize)](https://www.npmjs.com/package/recoilize) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/oslabs-beta/Recoilize/blob/staging/LICENSE) [![npm version](https://img.shields.io/npm/v/recoilize)](https://www.npmjs.com/package/recoilize) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

[Korean README 한국어](README_KO.md)

<h1> About</h1>
<p>
Recoilize is a Chrome Dev Tool meant for debugging applications built with the experimental Recoil.js state management library.

The tool records Recoil state and allows users to easily debug their applications with features such as time travel to previous states, visualization of the component graph and display of the atom selector network.

</p>

<p>
Download Recoilize from the <a href='https://chrome.google.com/webstore/detail/recoilize/jhfmmdhbinleghabnblahfjfalfgidik'>Chrome Store</a>
</p>

<p>Visit the Recoilize <a href='https://www.recoilize.io/'>landing page</a> to demo</p>

<h2>
** STILL IN BETA **
</h2>

<p>Please note that Recoilize is in BETA. We will continue to make improvements and implement fixes but if you find any issues, please dont hesitate to report them in the issues tab or submit a PR and we'll happily take a look.</p>

<h1>
Installation
</h1>

#### Install Recoilize Module

```js
npm install recoilize
```

### ** IMPORTANT **

#### Import RecoilizeDebugger from the Recoilize module

```js
import RecoilizeDebugger from 'recoilize';
```

#### Integrate RecoilizeDebugger as a React component within the recoil root:

```js
import RecoilizeDebugger from 'recoilize';
import RecoilRoot from 'recoil';

ReactDOM.render(
  <RecoilRoot>
    <RecoilizeDebugger />
    <App />
  </RecoilRoot>,
  document.getElementById('root'),
);
```

#### Please note, Recoilize assumes that the HTML element used to inject your React application has an ID of 'root'. If it does not the HTML element must be passed in as an attribute called 'root' to the RecoilizeDebugger component

#### Example:

```js
import RecoilizeDebugger from 'recoilize';
import RecoilRoot from 'recoil';

//If your app injects on an element with ID of 'app'
const app = document.getElementById('app');

ReactDOM.render(
  <RecoilRoot>
    <RecoilizeDebugger root={app} />
    <App />
  </RecoilRoot>,
  app,
);
```

#### Open your application on the Chrome Browser and start debugging with Recoilize!

##### (Only supported with React applications using Recoil as state management)

<h1>New Features for Version 1.0.0</h1>
<h3>Support for Recoil 0.1.2</h3>
<p>Recoilize now supports the most recent update to the Recoil library and is backwards compatible with older versions of Recoil.</p>

<h3>Clear Snapshots</h3>
<p>Previous and Forward clear buttons have been implemented to clear snapshots either before or after the currently selected snapshot</p>

<h3>Refactored Component Graph</h3>
<p>Visibility button was removed, and related data was incorporated into a new dropdown menu and hover functions</p>

<h4>Hover</h4>
<p>Improved hover functionality for the graph to display the information in more readable format</p>
<h4>Atom Legend</h4>
<p>The atom legend has been made clickable and will display a dropdown list of atoms or selectors</p>
<p>Each of the atom or selector in the dropdown list has also been made clickable to highlight the selected component in the graph</p>

<h3>Refactored Atom Network</h3>
<h4>Atom Legend</h4>
<p>The atom legend has been made clickable and will display a dropdown list of atoms or selectors</p>
<p>Each of the atom or selector in the dropdown list has also been made clickable to display the related atom and selector nodes</p>
<h4>Atom Network Graph</h4>
<p>Multiple atom network graphs no longer overlap each other</p>
<h4>Search bar bug fix</h4>
<p>Search bar no longer overlaps with navigation bar</p>

<h3>Easier to compare changes in Ranked Graph</h3>
<p>Removed the animation from the ranked graph to improve readability for changes in render times</p>

<h1>Features</h1>
<h3>Support for Concurrent Mode</h3>
<p>If a Suspense component was used as a placeholder during component renderings, those suspense components will display with a red border in the expanded component graph. This indicates that a component was suspended during the render of the selected snapshot.</p>

<h3>Performance Metrics</h3>
<p>In 'Metrics' tab, two graphs display component render times.

The flame graph displays the time a component took to render itself, and all of its child components. The bar graph displays the individual render times of each component.<p>

<h3>Time Travel</h3>
<p>As one of the key features of Recoilize, the tool enables users to jump to any previous snapshots. Pressing the jump button next to each of the snapshots will change the DOM by setting the state to that snapshot.<p>

<h3>Visualizations</h3>
<p>Users are able to view visualizations for their application's state by clicking individual snapshots. Recoilize provides component trees and graphs, as well as the state trees in JSON format.<p>

<h3>Throttle</h3>
<p>In the settings tab, users are able to set throttle (in milliseconds) for large scale applications or any applications that changes state rapidly. The default is set at 70ms.<p>

<h3>State Persistence (BETA)</h3>
<p>Recoilize allows the users to persist their application's state through a refresh or reload. At this time, the user is able to view the previous states in the dev tool, but cannot time travel to the states before refresh. The team is still working on completing this feature.</p>

<h3>Additional Features</h3>
<ul><li>legend to see relationship between component graph and state</li></ul>
<ul><li>toggle to view raw component graph</li></ul>
<ul><li>filter atom/selector network relationship</li></ul>
<ul><li>filter snapshots by atom/selector keys</li></ul>

<h2> We will continue updating Recoilize alongside Recoil's updates!</h2>

<h1>
 Contributors
</h1>

<h4>Bren Yamaguchi <a href='https://github.com/brenyama' target="_blank">@github </a><a  href='https://www.linkedin.com/in/brenyamaguchi/' target="_blank">@linkedin</a></h4>

<h4>Saejin Kang <a  href='https://github.com/skang1004' target="_blank">@github </a><a  href='https://www.linkedin.com/in/saejinkang1004/' target="_blank">@linkedin</a></h4>

<h4>Jonathan Escamila <a  href='https://github.com/jonescamilla' target="_blank">@github </a><a  href='https://www.linkedin.com/in/jon-escamilla/' target="_blank">@linkedin</a> </h4>

<h4>Sean Smith <a  href='https://github.com/SmithSean17' target="_blank">@github </a><a  href='https://www.linkedin.com/in/sean-smith17/' target="_blank">@linkedin</a> </h4>

<h4>Justin Choo <a href='https://github.com/justinchoo93' target="_blank">@github </a><a  href='https://www.linkedin.com/in/justinchoo93/' target="_blank">@linkedin</a></h4>

<h4>Anthony Lin <a  href='https://github.com/anthonylin198' target="_blank">@github </a><a  href='https://www.linkedin.com/in/anthony-lin/' target="_blank">@linkedin</a></h4>

<h4>Spenser Schwartz <a  href='https://github.com/spenserschwartz' target="_blank">@github </a><a  href='https://www.linkedin.com/in/spenser-schwartz/' target="_blank">@linkedin</a> </h4>

<h4>Steven Nguyen <a  href='https://github.com/Steven-Nguyen-T' target="_blank">@github </a><a  href='https://www.linkedin.com/in/steven-nguyen-t/' target="_blank">@linkedin</a> </h4>

<h4>Henry Taing <a  href='https://github.com/henrytaing' target="_blank">@github </a><a  href='https://www.linkedin.com/in/henrytaing/' target="_blank">@linkedin</a> </h4>

<h4>Seungho Baek <a  href='https://github.com/hobaek' target="_blank">@github </a><a  href='https://www.linkedin.com/in/s2unghobaek/' target="_blank">@linkedin</a> </h4>

<h4>Aaron Yang <a  href='https://github.com/aaronyang24' target="_blank">@github </a><a  href='https://www.linkedin.com/in/aaronyang24/' target="_blank">@linkedin</a> </h4>

<h4>Jesus Vargas <a  href='https://github.com/jmodestov' target="_blank">@github </a><a  href='https://www.linkedin.com/in/jesus-modesto-vargas/' target="_blank">@linkedin</a> </h4>

<h4>Davide Molino <a  href='https://github.com/davidemmolino' target="_blank">@github </a><a  href='https://www.linkedin.com/in/davide-molino/' target="_blank">@linkedin</a> </h4>

<h4>Taven Shumaker <a  href='https://github.com/TavenShumaker' target="_blank">@github </a><a  href='https://www.linkedin.com/in/Taven-Shumaker/' target="_blank">@linkedin</a> </h4>

<h4>Janis Hernandez <a  href='https://github.com/Janis-H' target="_blank">@github </a><a  href='https://www.linkedin.com/in/janis-h/' target="_blank">@linkedin</a> </h4>

<h4>Jaime Baik <a  href='https://github.com/jaimebaik' target="_blank">@github </a><a  href='https://www.linkedin.com/in/jaime-baik/' target="_blank">@linkedin</a> </h4>

<h4>Anthony Magallanes <a  href='https://github.com/amagalla' target="_blank">@github </a><a  href='https://www.linkedin.com/in/anthony-magallanes/' target="_blank">@linkedin</a> </h4>

<h4>Edward Shei <a  href='https://github.com/calibeach' target="_blank">@github </a><a  href='https://www.linkedin.com/in/edwardshei/' target="_blank">@linkedin</a> </h4>
