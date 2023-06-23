import { BlockAnimation } from "../Animation/BlockAnimation";
import { BlockType } from "./BlockType";

export const DEFAULT_BLOCK_SIZE = 50;
export class Block {
    // A block will have an BlockAnimation, a BlockType, a BlockTexture and a Textures array

    blockAnimation: BlockAnimation;
    blockType: BlockType;
    blockTexture: THREE.Texture; // Assuming you're using THREE.js for your WebGL rendering
    textures: THREE.Texture[];
    sprite: THREE.Sprite;

    constructor(blockAnimation: BlockAnimation, blockType: BlockType) {
        this.blockAnimation = blockAnimation;
        this.blockType = blockType;
    }

    setSprite(sprite: THREE.Sprite) {
        this.sprite = sprite;
    }

    updateBlock() {
        this.blockAnimation.updateAnimation(this.sprite);
    }
}
