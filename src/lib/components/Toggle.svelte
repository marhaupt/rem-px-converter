<script lang="ts">
    const TRANSITION_DURATION = 200;

    const blurTimeout = (e: FocusEvent) => {
        setTimeout(() => {
            const eventTarget = e.target as HTMLButtonElement;
            eventTarget.blur();
        }, TRANSITION_DURATION + 100);
    };
</script>

<button
    on:click
    class="toggle-icon"
    on:focus={blurTimeout}
    style:--duration={`${TRANSITION_DURATION}ms`}
>
    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 214.367 214.367">
        <path
            d="M202.403 95.22c0 46.312-33.237 85.002-77.109 93.484v25.663l-69.76-40 69.76-40v23.494c27.176-7.87 47.109-32.964 47.109-62.642 0-35.962-29.258-65.22-65.22-65.22s-65.22 29.258-65.22 65.22c0 9.686 2.068 19.001 6.148 27.688l-27.154 12.754c-5.968-12.707-8.994-26.313-8.994-40.441C11.964 42.716 54.68 0 107.184 0s95.219 42.716 95.219 95.22z"
        />
    </svg>
</button>

<style>
    .toggle-icon {
        --padding: 10px;

        height: calc(2 * var(--padding) + 1em);
        padding: var(--padding);

        font-size: 18px;
        line-height: 1;

        color: var(--color-purple);
        background: none;
        border: none;

        transition: color 200ms ease;

        cursor: pointer;
    }

    .toggle-icon:hover {
        color: var(--color-pink);
    }

    .toggle-icon svg {
        height: 1em;
        fill: currentColor;
    }

    .toggle-icon:focus svg {
        rotate: 1turn;
        transition-property: rotate;
        transition-duration: var(--duration);
    }
</style>
