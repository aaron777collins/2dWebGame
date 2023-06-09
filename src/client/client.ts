import * as THREE from 'three'
import Stats from 'stats.js'

import { characterAnimationData, CharacterAnimation, DIRECTIONS } from './Animation/CharacterAnimation'
import { Character, DEFAULT_CHARACTER_SIZE, createCharacter } from '../models/Character';
import { BlockManager } from './Blocks/BlockManager';
import { BlockType } from './Blocks/BlockType';
import { DEFAULT_BLOCK_SIZE } from './Blocks/Block';

let delta = 0;
let oldTimeStamp = 0;
let maxFPS = 120;
let characterAnimation;

export const blockManager = new BlockManager()

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    1,
    1000
)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

export const stats = new Stats()

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.left = window.innerWidth / -2
    camera.right = window.innerWidth / 2
    camera.top = window.innerHeight / 2
    camera.bottom = window.innerHeight / -2
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function gameLoop(timeStamp) {

    // Calculate how much time has passed
    delta = (timeStamp - oldTimeStamp) / 1000;

    update(delta)
    if (timeStamp < oldTimeStamp + (1000 / maxFPS)) {
        window.requestAnimationFrame(gameLoop)
        return;
    }
    oldTimeStamp = timeStamp;

    stats.begin()
    render()
    stats.end()

    window.requestAnimationFrame(gameLoop)
}

function update(delta) {
    updateCharacter(delta)
}

function render() {
    characterAnimation.updateAnimations()
    blockManager.updateBlocks()
    renderer.render(scene, camera)
}

// Your addHelpText function remains the same

// Character movement and flipping logic
const character = {
    sprite: null,
    flipped: false,
    velocity: new THREE.Vector2(0, 0),
    speed: 100,
    speedFrictionRatio: 0.90,
    textures: [],
    attacking: false,
    slowDownCoefficientOnAttack: 0.1,
    emptyCollisionPixels: {
        top: 45,
        bottom: 11,
        left: 35,
        right: 35,
    },
} as Character

type timeouttype = ReturnType<typeof setTimeout>

const KEY_STATES = {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    SPACE: false,
}

function handleKeyDown(event) {
    switch (event.code) {
        case 'ArrowLeft':
            KEY_STATES.LEFT = true
            KEY_STATES.RIGHT = false
            break
        case 'ArrowRight':
            KEY_STATES.RIGHT = true
            KEY_STATES.LEFT = false
            break
        case 'ArrowUp':
            KEY_STATES.UP = true
            KEY_STATES.DOWN = false
            break
        case 'ArrowDown':
            KEY_STATES.DOWN = true
            KEY_STATES.UP = false
            break
        case 'Space':
            KEY_STATES.SPACE = true
            break
    }
}

function handleKeyUp(event) {
    switch (event.code) {
        case 'ArrowLeft':
            KEY_STATES.LEFT = false
            break
        case 'ArrowRight':
            KEY_STATES.RIGHT = false
            break
        case 'ArrowUp':
            KEY_STATES.UP = false
            break
        case 'ArrowDown':
            KEY_STATES.DOWN = false
            break
        case 'Space':
            KEY_STATES.SPACE = false
            break
    }
}

function isFlipped() {
    // flipped if left is pressed.
    // not flipped if right, up or down is pressed.
    let flipped = character.flipped
    if (KEY_STATES.LEFT && !KEY_STATES.UP && !KEY_STATES.DOWN) {
        flipped = true
    } else if (KEY_STATES.RIGHT) {
        flipped = false
    } else if (KEY_STATES.UP) {
        flipped = false
    } else if (KEY_STATES.DOWN) {
        flipped = false
    }

    return flipped
}

function collisionDetection(delta) {
    // check if the character is colliding with any solid blocks
    for (let i = 0; i < blockManager.solidBlocksInstances.length; i++) {
        const block = blockManager.solidBlocksInstances[i]

        // check if the character is colliding with the block
        // Accounts for the player offset from the center of the sprite
        // and the empty pixels around the sprite

        const characterLeft = character.sprite.position.x - DEFAULT_CHARACTER_SIZE / 2 + character.emptyCollisionPixels.left
        const characterRight = character.sprite.position.x + DEFAULT_CHARACTER_SIZE / 2 - character.emptyCollisionPixels.right
        const characterTop = character.sprite.position.y + DEFAULT_CHARACTER_SIZE / 2 - character.emptyCollisionPixels.top
        const characterBottom = character.sprite.position.y - DEFAULT_CHARACTER_SIZE / 2 + character.emptyCollisionPixels.bottom
        const blockLeft = block.sprite.position.x - DEFAULT_BLOCK_SIZE / 2
        const blockRight = block.sprite.position.x + DEFAULT_BLOCK_SIZE / 2
        const blockTop = block.sprite.position.y + DEFAULT_BLOCK_SIZE / 2
        const blockBottom = block.sprite.position.y - DEFAULT_BLOCK_SIZE / 2


        if (
            characterLeft < blockRight &&
            characterRight > blockLeft &&
            characterTop > blockBottom &&
            characterBottom < blockTop
        ) {

            // if the character is colliding with the block, move the character back to where it was before
            character.sprite.position.x -= character.velocity.x
            character.sprite.position.y -= character.velocity.y


            // if the character is attacking, destroy the block
            if (character.attacking) {
                blockManager.destroyBlockInstance(block, scene)
            }
        }
    }
}

function updateCharacter(delta) {

    // check collision
    collisionDetection(delta);

    if (!character.attacking) {
        character.flipped = isFlipped()

        let characterSpeedWithDelta = character.speed * delta

        if (KEY_STATES.LEFT) {
            character.velocity.x = -characterSpeedWithDelta
            characterAnimationData.currentAnimation = 'walkRight'
            characterAnimationData.mostRecentDirection = DIRECTIONS.right
        } else if (KEY_STATES.RIGHT) {
            character.velocity.x = characterSpeedWithDelta
            characterAnimationData.currentAnimation = 'walkRight'
            characterAnimationData.mostRecentDirection = DIRECTIONS.right
        }
        if (KEY_STATES.UP) {
            character.velocity.y = characterSpeedWithDelta
            characterAnimationData.currentAnimation = 'walkBack'
            characterAnimationData.mostRecentDirection = DIRECTIONS.back
        } else if (KEY_STATES.DOWN) {
            character.velocity.y = -characterSpeedWithDelta
            characterAnimationData.currentAnimation = 'walk'
            characterAnimationData.mostRecentDirection = DIRECTIONS.normal
        }

        if (KEY_STATES.SPACE && !character.attacking) {
            character.attacking = true
            console.log(2 * delta)
            character.velocity.x /= character.slowDownCoefficientOnAttack * (1+delta)
            character.velocity.y /= character.slowDownCoefficientOnAttack * (1+delta)

            // attack
            if (characterAnimationData.mostRecentDirection === DIRECTIONS.normal) {
                characterAnimationData.currentAnimation = 'attack'
            } else if (characterAnimationData.mostRecentDirection === DIRECTIONS.back) {
                characterAnimationData.currentAnimation = 'attackBack'
            } else if (characterAnimationData.mostRecentDirection === DIRECTIONS.right) {
                characterAnimationData.currentAnimation = 'attackRight'
            } else {
                // should not be reached
                characterAnimationData.currentAnimation = 'attack'
            }
        }
    }

    character.velocity.x *= character.speedFrictionRatio * (1-delta)
    if (Math.abs(character.velocity.x) < 0.01*delta) {
        character.velocity.x = 0
    }


    character.velocity.y *= character.speedFrictionRatio * (1-delta)
    if (Math.abs(character.velocity.y) < 0.01*delta) {
        character.velocity.y = 0
    }

    // If no key is pressed, return to idle
    let animating = character.attacking // same as false || character.attacking
    Object.keys(KEY_STATES).forEach((key) => {
        if (KEY_STATES[key]) {
            animating = true
        }
    })
    if (!animating && character.velocity.x === 0 && character.velocity.y === 0) {
        if (characterAnimationData.mostRecentDirection === DIRECTIONS.normal) {
            characterAnimationData.currentAnimation = 'idle'
        } else if (characterAnimationData.mostRecentDirection === DIRECTIONS.back) {
            characterAnimationData.currentAnimation = 'idleBack'
        } else if (characterAnimationData.mostRecentDirection === DIRECTIONS.right) {
            characterAnimationData.currentAnimation = 'idleRight'
        } else {
            // should not be reached
            characterAnimationData.currentAnimation = 'idle'
        }
    }

    // Update character position
    character.sprite.position.x += character.velocity.x
    character.sprite.position.y += character.velocity.y
}

// Background-related logic
function createBackground() {
    const textureLoader = new THREE.TextureLoader()
    const backgroundTexture = textureLoader.load('static/background.jpg')
    const backgroundMaterial = new THREE.SpriteMaterial({ map: backgroundTexture, color: 0xffffff })

    const background = new THREE.Sprite(backgroundMaterial)
    background.scale.set(2000, 1000, 1) // Adjust the scale according to your needs
    background.position.set(0, 0, -5) // Move background behind the character

    scene.add(background)
}

function removeHelpText() {
    document.getElementById('help-text').style.display = 'none';
    window.removeEventListener('keydown', removeHelpText)
}

function addHelpText() {
    // centered help text will disappear after 5 seconds and will also dissapear after pressing any key
    const helpText = document.createElement('div')
    helpText.innerHTML = 'Use the arrow keys to move and space to attack'
    helpText.style.position = 'absolute'
    helpText.style.top = '50%'
    helpText.style.left = '50%'
    helpText.style.transform = 'translate(-50%, -50%)'
    helpText.style.color = 'white'
    helpText.style.fontSize = '20px'
    helpText.style.fontFamily = 'sans-serif'
    helpText.style.zIndex = '1'
    helpText.id = 'help-text'
    document.body.appendChild(helpText)

    window.addEventListener('keydown', removeHelpText)
}

window.addEventListener('DOMContentLoaded', () => {

    // add help text
    addHelpText()


    // add stats
    document.body.appendChild(stats.dom)
    stats.showPanel(0)

    createBackground() // Add the background to the scene

    const textureLoader = new THREE.TextureLoader()
    const atlasTexture = textureLoader.load(
        'static/character.png',
        async (texture) => {
            //callback
            const characterData = createCharacter(
                atlasTexture,
                scene,
                characterAnimationData.x_tiles,
                characterAnimationData.y_tiles
            ) // Assuming a 6x10 grid
            character.sprite = characterData.sprite
            character.textures = characterData.textures

            // Add event listeners for keyboard controls
            window.addEventListener('keydown', handleKeyDown)
            window.addEventListener('keyup', handleKeyUp)

            // create Animation object
            characterAnimation = new CharacterAnimation(character)

            // Create blocks
            await blockManager.createBlockAnimationMap()
            blockManager.createBlockTypeMap()

            // Get width of the screen
            const screenWidth = window.innerWidth
            // Get height of the screen
            const screenHeight = window.innerHeight
            // width of the block (need to get this from the block class)
            const blockWidth = DEFAULT_BLOCK_SIZE

            // putting block at top left corner (center is 0,0)
            const topLeftCorner = new THREE.Vector3(
                -screenWidth / 2 + blockWidth / 2,
                screenHeight / 2 - blockWidth / 2,
                -1
            )

            // fill screen with grass1 and grass2 blocks (alternating)
            for (let i = 0; i < screenWidth / blockWidth; i++) {
                for (let j = 0; j < screenHeight / blockWidth; j++) {
                    if ((i + j) % 2 === 0) {
                        blockManager.createBlockInstance("grass1", scene, new THREE.Vector3(topLeftCorner.x + i * blockWidth, topLeftCorner.y - j * blockWidth, topLeftCorner.z))
                    } else {
                        blockManager.createBlockInstance("grass2", scene, new THREE.Vector3(topLeftCorner.x + i * blockWidth, topLeftCorner.y - j * blockWidth, topLeftCorner.z))
                    }
                }
            }

            // thick wall of 5 stone1 blocks near the center (grid aligned)
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    blockManager.createBlockInstance("stone1", scene, new THREE.Vector3(blockWidth * 5 + topLeftCorner.x + i * blockWidth, -blockWidth * 5 + topLeftCorner.y - j * blockWidth, topLeftCorner.z))
                }
            }

            // blockManager.createBlockInstance("grass1", scene, topLeftCorner)
            // blockManager.createBlockInstance("grass2", scene, topLeftCorner.add(new THREE.Vector3(50, 0, 0)))


            // Your help text and stats code remains the same
            window.requestAnimationFrame(gameLoop)
        },
        (event) => {
            // onProgress
            // create loading dom in the middle of the page
            const loadingDom = document.createElement('div')

            loadingDom.style.position = 'absolute'
            loadingDom.style.top = '50%'
            loadingDom.style.left = '50%'
            loadingDom.style.transform = 'translate(-50%, -50%)'

            loadingDom.innerText = `${Math.round((event.loaded / event.total) * 100)}%`

            document.body.appendChild(loadingDom)
        },
        (err) => {
            // onError
            console.error('Unexpected error while loading texture: ', err)

            // display error message in the middle of the page
            const errorDom = document.createElement('div')

            errorDom.style.position = 'absolute'

            errorDom.style.top = '50%'
            errorDom.style.left = '50%'
            errorDom.style.transform = 'translate(-50%, -50%)'

            errorDom.innerText = 'Unexpected error while loading texture'

            document.body.appendChild(errorDom)
        }
    )
})
