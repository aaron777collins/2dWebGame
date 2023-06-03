import * as THREE from 'three'
import Stats from 'stats.js'

import { characterAnimationData, CharacterAnimation, DIRECTIONS } from './Animation/CharacterAnimation'
import { Character } from '../models/Character';
import { createTextureAtlasGrid } from './Texture/Texture';

let delta = 0;
let oldTimeStamp = 0;
let maxFPS = 120;
let animation;

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

const stats = new Stats()

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

    if (timeStamp < oldTimeStamp + (1000 / maxFPS)) {
        update(delta)
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
    animation.updateAnimations()
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
} as Character

type timeouttype = ReturnType<typeof setTimeout>

function createCharacter(textureAtlas: THREE.Texture, tilesHoriz = 1, tilesVert = 1) {
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
    sprite.scale.set(100, 100, 1)
    scene.add(sprite)

    return { sprite: sprite, textures: textures }
}

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

function updateCharacter(delta) {
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
        (texture) => {
            //callback
            const characterData = createCharacter(
                atlasTexture,
                characterAnimationData.x_tiles,
                characterAnimationData.y_tiles
            ) // Assuming a 6x10 grid
            character.sprite = characterData.sprite
            character.textures = characterData.textures

            // Add event listeners for keyboard controls
            window.addEventListener('keydown', handleKeyDown)
            window.addEventListener('keyup', handleKeyUp)

            // create Animation object
            animation = new CharacterAnimation(stats, character)

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
