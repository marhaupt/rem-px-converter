<script lang="ts">
    import Toggle from '$lib/components/Toggle.svelte';
    import { transformPxToRem, transformRemToPx } from '$lib/utils';
    import { fly } from 'svelte/transition';

    let inputValue: string = '';
    let transformedOutput: string | undefined;
    let copied = false;
    let clickX = 0;
    let clickY = 0;
    let remSize = 16;

    let mode: 'rem2px' | 'px2rem' = 'rem2px';

    $: if (inputValue.trim().length > 0) {
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
</script>

<main>
    <div
        class="copy-notification"
        class:copied
        style:--click-x={`${clickX}px`}
        style:--click-y={`${clickY}px`}
    >
        Copied!
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
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
    <textarea bind:value={inputValue} />
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
        margin-bottom: 20px;
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        column-gap: 6px;
        align-items: center;

        @media (width < 500px) {
            margin-bottom: 10px;
        }
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
        font-family: 'Fira Mono', monospace;
        font-size: 16px;
        line-height: 1.8;

        @media (width < 500px) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    textarea {
        position: relative;
        resize: vertical;
        field-sizing: content;
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

        &.empty::after {
            opacity: 0;
            transition-delay: 0ms;
        }

        &::after {
            content: 'Click to copy';
            position: absolute;
            inset: 14px 0;
            color: var(--color-pink);
            font-size: 2em;
            z-index: -1;
            text-align: center;
            opacity: 0.5;
            transition: opacity 400ms ease 100ms;
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

        &.copied {
            transition-duration: 50ms;
            transition-delay: 0ms;
            opacity: 1;
        }
    }
</style>
