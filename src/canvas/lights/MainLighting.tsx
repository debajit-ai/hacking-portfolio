export default function MainLighting() {
    return (
        <group>
            {/* Key Light */}
            <directionalLight
                castShadow
                position={[4, 5, 4]}
                intensity={2.5}
                color="#ffffff"
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
            />

            {/* Fill Light */}
            <directionalLight
                position={[-5, 2, 3]}
                intensity={0.8}
                color="#e6eaf5"
            />

            {/* Rim Light */}
            <directionalLight
                position={[-2, 4, -6]}
                intensity={2.2}
                color="#f0f4ff"
            />

            {/* Top Light */}
            <directionalLight
                position={[0, 8, 0]}
                intensity={0.6}
                color="#ffffff"
            />
        </group>
    );
}