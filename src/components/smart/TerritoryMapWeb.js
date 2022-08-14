import { useCallback, useEffect, useRef, useState } from "react";
import Language from "../../common/lang";
import MapFn from "../../common/map-fn";

import styles, { colors } from "../../styles/main";
import { ButtonLink } from "../elements/Button";

export default function TerritoryMapWeb({
  user = {},
  mapData = null,
  apiKey = "",
}) {
  const mapContainer = useRef(null);
  const gaJsContainer = useRef(null);

  const loadMap = useCallback(() => {
    window.MapFn = window.MapFn || MapFn;
    MapFn.container = mapContainer.current;
    const headerHeight = 24;
    const screenHeight =
      ((window.innerHeight ? window.innerHeight - window.screen.availTop : 0) ||
        window.screen.height) - headerHeight || 480;
    MapFn.container.setAttribute(
      "style",
      "height: " + screenHeight + "px; border: 4px solid #ddd;"
    );
    MapFn.GA = google;
    MapFn.GAIsLoaded = true;
    MapFn.initializeMap(mapData.addresses, mapData.boundaries);
  }, [mapContainer]);

  useEffect(() => {
    if (!MapFn.GAIsLoaded) {
      if (window.google) {
        loadMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry`;
        script.onload = function () {
          console.log("script is loaded");
          loadMap();
        };
        gaJsContainer.current.appendChild(script);
      }
    }

    return () => {
      MapFn.GAIsLoaded = false;
    };
  }, []);

  return (
    <div>
      <div>
        {user.isManager && 1 == 2 // Hide for now
          ? [
              <ButtonLink
                key="edit-boundary"
                onClick={() => console.log("edit boundary")}
              >
                {Language.translate("Edit Boundary")}
              </ButtonLink>,
              <ButtonLink
                key="edit-markers"
                onClick={() => console.log("edit markers")}
              >
                {Language.translate("Edit Markers")}
              </ButtonLink>,
            ]
          : null}
      </div>
      <div
        id="territory-map"
        ref={mapContainer}
        // style={{ height: fullHeight, width: "100%" }}
      />
      <script id="ga-script" ref={gaJsContainer} async defer></script>
    </div>
  );
}
