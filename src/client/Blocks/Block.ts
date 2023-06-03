import { BlockAnimation } from "../Animation/BlockAnimation";
import { BlockType } from "./BlockType";

class Block {
    // A block will have an BlockAnimation, a BlockType and a BlockTexture

    blockAnimation: BlockAnimation;
    blockType: BlockType;

    constructor(blockAnimation, blockType, blockTexture) {
        this.blockAnimation = blockAnimation;
        this.blockType = blockType;
    }
}
