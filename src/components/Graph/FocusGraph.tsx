// import dynamic from "next/dynamic";
import { useGraph } from "@/context/GraphContext";
import React, { useCallback, useRef } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";

const FocusGraph = () => {
    const fgRef = useRef<ForceGraphMethods>();

    const { graphData, setSelectAddress } = useGraph();

    const handleClick = useCallback(
        (node) => {
            const distance = 90;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
            if (fgRef.current) {
                fgRef.current.cameraPosition(
                    {
                        x: node.x * distRatio,
                        y: node.y * distRatio,
                        z: node.z * distRatio,
                    },
                    node,
                    3000
                );
            }
            setSelectAddress(node.id);
        },
        [fgRef, setSelectAddress]
    );

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    const localImgs = [
        "/red.jpg",
        "/blue.png",
        "/brown.png",
        "/green.png",
        "/grey.png",
    ];

    return (
        <ForceGraph3D
            ref={fgRef}
            graphData={graphData}
            nodeLabel="id"
            nodeAutoColorBy="group"
            onNodeClick={handleClick}
            linkColor="#458888"
            linkWidth={0.5}
            backgroundColor="#000000"
            nodeThreeObject={(node: any) => {
                const imgTexture = new THREE.TextureLoader().load(
                    node.img || localImgs[getRandomInt(localImgs.length)]
                    // Randomly give one
                );
                const geometry = new THREE.SphereGeometry(2, 6, 6);

                const material = new THREE.MeshBasicMaterial({
                    map: imgTexture,
                });
                const mesh = new THREE.Mesh(geometry, material);
                return mesh;
            }}
        />
    );
};

export default FocusGraph;
