<script lang="ts">
    import Size from '$lib/components/Size.svelte';
    import Toggle from '$lib/components/Toggle.svelte';
    import {
        DEFAULT_REM_SIZE,
        LOCAL_STORAGE_MODE_KEY,
        LOCAL_STORAGE_REM_BASE_SIZE_KEY
    } from '$lib/constants';
    import type { Mode } from '$lib/types';
    import { transformPxToRem, transformRemToPx } from '$lib/utils';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { browser } from '$app/environment';

    let inputValue: string = '';
    let transformedOutput: string | undefined;
    let copied = false;
    let clickX = 0;
    let clickY = 0;
    let remSize: number | null = null;

    let mode: Mode | null = null;

    $: if (inputValue.trim().length > 0 && remSize !== null) {
        transformedOutput =
            mode === 'rem2px'
                ? transformRemToPx(inputValue, remSize)
                : transformPxToRem(inputValue, remSize);
    } else {
        transformedOutput = undefined;
    }

    const copyOutput = (e: MouseEvent) => {
        if (transformedOutput) {
            navigator.clipboard.writeText(transformedOutput).then(() => {
                copied = true;

                clickX = e.clientX;
                clickY = e.clientY;

                setTimeout(() => (copied = false), 200);
            });
        }
    };

    const changeMode = () => {
        if (mode === 'rem2px') {
            mode = 'px2rem';
        } else {
            mode = 'rem2px';
        }
    };

    onMount(() => {
        if (browser) {
            const remSizeFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_REM_BASE_SIZE_KEY);
            const modeFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_MODE_KEY);

            remSize = remSizeFromLocalStorage
                ? parseInt(remSizeFromLocalStorage)
                : DEFAULT_REM_SIZE;

            console.log('MODE', mode);
            mode = modeFromLocalStorage ? (modeFromLocalStorage as Mode) : 'rem2px';
        } else {
            remSize = DEFAULT_REM_SIZE;
        }
    });

    $: {
        if (mode !== null && browser) {
            localStorage.setItem(LOCAL_STORAGE_MODE_KEY, mode);
        }
    }

    $: if (remSize !== null && browser) {
        localStorage.setItem(LOCAL_STORAGE_REM_BASE_SIZE_KEY, remSize.toString());
    }
</script>

<svelte:head>
    <link rel="icon" href={`/favicon-${mode}.svg`} />
    <title>{mode}</title>
</svelte:head>
<main>
    <div
        class="copy-notification"
        class:copied
        style:--click-x={`${clickX}px`}
        style:--click-y={`${clickY}px`}
    >
        Copied!
    </div>

    <header>
        {#key mode}
            <h1 in:fly={{ x: 0, y: -30 }} out:fly={{ x: 0, y: 30 }}>
                {#if mode === 'rem2px'}
                    <span>rem</span><span class="title to">2</span><span>px</span>
                {:else}
                    <span>px</span><span class="title to">2</span><span>rem</span>
                {/if}
            </h1>
        {/key}
        <div class="mode-switch">
            <Toggle on:click={changeMode} />
        </div>
    </header>

    <div class="size">
        <Size bind:remSize />
    </div>

    <section class="left">
        <textarea bind:value={inputValue} />
    </section>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <pre
        on:click={copyOutput}
        style:--click-x={`${clickX}px`}
        style:--click-y={`${clickY}px`}
        class:empty={transformedOutput === undefined}
        class:copied>{transformedOutput ?? 'nothing yet'}</pre>
</main>

<style>
    header {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        column-gap: 6px;
        align-items: center;
    }

    h1 {
        grid-column: 2;
        grid-row: 1;
        margin: 0;
        text-align: center;
        color: var(--color-pink);
        width: 6ch;
    }

    h1 span {
        text-shadow: 0 0 10px currentColor;
    }

    .title.to {
        color: var(--color-purple);
    }

    .mode-switch {
        grid-column: 3;
        grid-row: 1;
    }

    main {
        max-width: 700px;
        margin-inline: auto;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 20px;
        row-gap: 20px;
        line-height: 1.8;

        @media (width < 500px) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    .size {
        grid-column: 1 / -1;
    }

    section.left {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    textarea {
        position: relative;
        resize: vertical;
        min-height: 5lh;
        max-height: 10lh;
        padding: 10px 18px;
        font-size: inherit;
        line-height: inherit;
        background-color: var(--color-gray-dark);
        border: 2px solid var(--color-purple);
        outline: none;
        color: var(--color-white);
        transition:
            border-color 200ms ease,
            box-shadow 200ms ease;
        white-space: nowrap;
        border-radius: 4px;

        &:focus {
            border-color: var(--color-pink);
            box-shadow: 0 2px 16px var(--color-pink-alpha60);
        }
    }

    pre {
        margin: 0;
        padding-block: 10px;
        max-width: 100%;
        overflow: scroll;
        transition-property: color;
        transition-timing-function: ease-out;
        transition-duration: 600ms;
        position: relative;
        min-height: 5lh;

        &:not(.empty) {
            cursor: pointer;
        }

        &.empty {
            opacity: 0.5;
        }

        &.copied {
            color: var(--color-pink);
            transition-duration: 50ms;
        }

        &::after {
            content: 'Click to copy';
            position: absolute;
            inset: 14px 0;
            color: var(--color-pink);
            font-size: 2em;
            z-index: -1;
            text-align: center;
            opacity: 0.4;
            transition: opacity 400ms ease 100ms;
        }

        &.copied::after {
            opacity: 0.2;
            transition-delay: 0ms;
            transition-duration: 50ms;
        }

        &.empty::after {
            opacity: 0;
            transition-delay: 0ms;
        }

        @media (width < 500px) {
            padding-inline: 18px;
        }
    }

    .copy-notification {
        display: block;
        background-color: var(--color-purple);
        position: absolute;
        top: var(--click-y);
        left: var(--click-x);
        opacity: 0;
        color: var(--color-white);
        transition-property: opacity;
        transition-timing-function: ease-out;
        transition-duration: 300ms;
        transition-delay: 300ms;
        padding: 6px 16px;
        border-radius: 4px;
        box-shadow: 0 0 12px var(--color-purple);
        translate: -10% -90%;
        pointer-events: none;
        z-index: 100;

        &.copied {
            transition-duration: 50ms;
            transition-delay: 0ms;
            opacity: 1;
        }
    }
</style>
