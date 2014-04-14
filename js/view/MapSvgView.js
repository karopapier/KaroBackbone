<svg id="mapview" ng-attr-width="300" ng-attr-height="200" style="border: 1px solid red">
      <defs>
          <style type="text/css"><![CDATA[
          .grass {
              fill: rgb(0,200,0);
          }

          .road {
              fill: rgb(128,128,128);
          }

          .mud {
              fill: rgb(100,70,0);
          }

          .sand {
              fill: rgb(230,230,115);
          }

          .water {
              fill: blue;
          }

          .earth {
              fill: brown;
          }

          .parc {
              fill: rgb(200,200,200);
          }

          .cp1 {

          }

          ]]></style>
          <!--<filter id='n' x='0' y='0'>
              <feTurbulence type='fractalNoise' baseFrequency='2' numOctaves='1' stitchTiles='stitch'/>
          </filter> -->
          <pattern id="grid" patternUnits="userSpaceOnUse" width="13" height="13" x="0" y="0">
            <line x1="13" y1="0" x2="13" y2="13" stroke="black" stroke-width="1" ></line>
            <line x1="0" y1="13" x2="13" y2="13" stroke="black" stroke-width="1" ></line>
          </pattern>
      </defs>
      <rect class="grass" x="0" y="0" width="100%" height="100%"  />
      <!--<rect x="0" y="0" width="100%" height="100%" filter="url(#n)" opacity='0.7'/>-->
      <!-- <g ng-repeat="path in paths">
          <path ng-attr-d="{{ path.path }}" class="{{ path.class }}" />
      </g>-->
      <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" opacity=".3"></rect>
  </svg>