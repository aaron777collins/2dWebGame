import { Block } from "./Block";
import { BlockType } from "./BlockType";
import { BlockAnimation } from "../Animation/BlockAnimation";
import * as THREE from "three";
import { createTextureAtlasGrid } from "../Texture/Texture";

export class BlockManager {

    blockAnimationMap: Map<string, BlockAnimation> = new Map();
    blockTypeMap: Map<string, BlockType> = new Map();
    blocks: Block[] = [];

    createBlock(blockAnimation: BlockAnimation, blockType: BlockType): Block {
        const block = new Block(blockAnimation, blockType);
        this.blocks.push(block);
        return block;
    }

    updateBlocks() {
        for (const block of this.blocks) {
            block.updateBlock();
        }
    }

    async createBlockAnimationMap() {

        let loaderPromise = new Promise((resolve, reject) => {
            function loadDone(x) {
                resolve(x);
            }

            const texture = new THREE.TextureLoader().load("static/blocks.png", loadDone);
        });



        // load texture
        const texture = await loaderPromise;
        // const texture = new THREE.TextureLoader().load("static/blocks.png", (texture) => {
        // create texture atlas grid
        const textures = createTextureAtlasGrid(texture, 5, 2).reverse()

        textures.forEach((texture) => {
            // repeat mirror
            texture.wrapS = THREE.RepeatWrapping
        })

        // grass1
        const grass1 = new BlockAnimation(0, 4, 0, 1000, textures)
        this.blockAnimationMap.set("grass1", grass1)

        // grass2
        const grass2 = new BlockAnimation(5, 9, 0, 1000, textures)
        this.blockAnimationMap.set("grass2", grass2)


    }

    createBlockTypeMap() {
        this.blockTypeMap.set("grass1", BlockType.Solid);
        this.blockTypeMap.set("grass2", BlockType.Solid);
    }

    createBlockInstance(type: string, scene: THREE.Scene, location: THREE.Vector3) {
        const blockAnimation = this.blockAnimationMap.get(type);
        const blockType = this.blockTypeMap.get(type);
        const block = this.createBlock(blockAnimation, blockType);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: block.blockAnimation.texture,
            color: 0xffffff,
        })
        spriteMaterial.side = THREE.DoubleSide
        spriteMaterial.transparent = true

        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.scale.set(50, 50, 1)

        block.setSprite(sprite);
        sprite.position.set(location.x, location.y, location.z);
        scene.add(sprite)
        return block;
    }


}
