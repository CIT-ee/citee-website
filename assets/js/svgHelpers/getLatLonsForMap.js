import { event as d3Event, select } from 'd3-selection';

function rectContains(rect, circleNode) {
    const [ cx, cy ] = [ select(circleNode).attr('cx'), select(circleNode).attr('cy') ];
    return (cx > rect.x1 &&
          cx < rect.x2 &&
          cy > rect.y1 &&
          cy < rect.y2);
}

export function getLatLonsForMap(brushGenerator, svgParams, callback) {
    const circleNodes = svgParams.circles.nodes();
    let brushRect;

    // eslint-disable-next-line prefer-arrow-callback
    brushGenerator.on('brush end', function updateBrush() {
        let latLonsForMap;
        brushRect = d3Event.selection;
        if (!brushRect) {
            latLonsForMap = [];
        } else {
            [
                brushRect.x1,
                brushRect.y1,
                brushRect.x2,
                brushRect.y2,
            ] = [
                brushRect[ 0 ][ 0 ],
                brushRect[ 0 ][ 1 ],
                brushRect[ 1 ][ 0 ],
                brushRect[ 1 ][ 1 ],
            ];

            const selectedcircleNodes = circleNodes.filter(circleNode =>
                rectContains(brushRect, circleNode));

            const latLons = selectedcircleNodes.map(circleNode =>
                [
                    +select(circleNode).datum().lat,
                    +select(circleNode).datum().lon,
                ]);

            latLonsForMap = latLons.map(elem => ({
                position: {
                    lat: elem[ 0 ],
                    lng: elem[ 1 ],
                },
            }));
        }
        callback(latLonsForMap);
    });
}
