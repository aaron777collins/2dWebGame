export class Texture {



}

export function createTextureAtlasGrid(atlasTexture, tilesHoriz, tilesVert, flipped = false) {
    const textures: THREE.Texture[] = []
    for (let i = 0; i < tilesVert; i++) {
        for (let j = tilesHoriz - 1; j >= 0; j--) {
            const tileTexture = atlasTexture.clone()
            tileTexture.needsUpdate = true
            tileTexture.repeat.set(1 / tilesHoriz, 1 / tilesVert)
            tileTexture.offset.set(j / tilesHoriz, i / tilesVert)
            textures.push(tileTexture)
        }
    }
    return textures
}
