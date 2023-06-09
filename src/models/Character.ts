import * as THREE from 'three'
import { createTextureAtlasGrid } from "../client/Texture/Texture";

export interface Character {
    sprite: any,
    flipped: boolean,
    velocity: THREE.Vector2
    speed: number,
    speedFrictionRatio: number,
    textures: Array<any>,
    attacking: boolean,
    slowDownCoefficientOnAttack: number,
    emptyCollisionPixels: {
        top: number,
        bottom: number,
        left: number,
        right: number,
    },
}

export const DEFAULT_CHARACTER_SIZE = 100

export function createCharacter(textureAtlas: THREE.Texture, scene, tilesHoriz = 1, tilesVert = 1) {
    const textures = createTextureAtlasGrid(textureAtlas, tilesHoriz, tilesVert).reverse()

    textures.forEach((texture) => {
        // repeat mirror
        texture.wrapS = THREE.RepeatWrapping
    })

    const spriteMaterial = new THREE.SpriteMaterial({
        map: textures[0],
        color: 0xffffff,
    })
    spriteMaterial.side = THREE.DoubleSide
    spriteMaterial.transparent = true

    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(DEFAULT_CHARACTER_SIZE, DEFAULT_CHARACTER_SIZE, 1)
    scene.add(sprite)

    return { sprite: sprite, textures: textures }
}
