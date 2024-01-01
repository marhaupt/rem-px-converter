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
        align-items: center;
        column-gap: 6px;
    }

    h1 {
        grid-column: 2;
        grid-row: 1;

        width: 6ch;
        margin: 0;

        text-align: center;

        color: var(--color-pink);

        & span {
            text-shadow: 0 0 10px currentColor;
        }
    }

    .title.to {
        color: var(--color-purple);
    }

    .mode-switch {
        grid-column: 3;
        grid-row: 1;
    }

    main {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 20px;
        row-gap: 20px;

        max-width: 700px;
        margin-inline: auto;

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

        min-height: 5lh;
        max-height: 10lh;
        padding: 10px 18px;

        font-size: inherit;
        line-height: inherit;
        white-space: nowrap;

        color: var(--color-white);
        background-color: var(--color-gray-dark);
        border: 2px solid var(--color-purple);
        border-radius: 4px;
        outline: none;

        transition:
            border-color 200ms ease,
            box-shadow 200ms ease;

        resize: vertical;

        &:focus {
            box-shadow: 0 2px 16px var(--color-pink-alpha60);
            border-color: var(--color-pink);
        }
    }

    pre {
        position: relative;

        max-width: 100%;
        min-height: 5lh;
        margin: 0;
        padding-block: 10px;

        transition-property: color;
        transition-duration: 600ms;
        transition-timing-function: ease-out;

        overflow: scroll;

        &::after {
            position: absolute;
            inset: 14px 0;
            z-index: -1;

            content: 'Click to copy';

            font-size: 2em;
            text-align: center;

            color: var(--color-pink);

            opacity: 0.4;
            transition: opacity 400ms ease 100ms;
        }

        &:not(.empty) {
            cursor: pointer;
        }

        &.empty {
            opacity: 0.5;

            &::after {
                opacity: 0;
                transition-delay: 0ms;
            }
        }

        &.copied {
            color: var(--color-pink);
            transition-duration: 50ms;

            &::after {
                opacity: 0.2;
                transition-duration: 50ms;
                transition-delay: 0ms;
            }
        }

        @media (width < 500px) {
            padding-inline: 18px;
        }
    }

    .copy-notification {
        position: absolute;
        top: var(--click-y);
        left: var(--click-x);
        z-index: 100;

        display: block;

        padding: 6px 16px;

        color: var(--color-white);
        background-color: var(--color-purple);
        border-radius: 4px;
        box-shadow: 0 0 12px var(--color-purple);

        opacity: 0;
        transition-property: opacity;
        transition-duration: 300ms;
        transition-timing-function: ease-out;
        transition-delay: 300ms;

        translate: -10% -90%;
        pointer-events: none;

        &.copied {
            opacity: 1;
            transition-duration: 50ms;
            transition-delay: 0ms;
        }
    }
</style>
