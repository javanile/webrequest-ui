
const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
        classes: 'shadow-md bg-purple-dark',
        scrollTo: { behavior: 'smooth', block: 'center' }
    }
});

tour.addStep({
    id: 'example-step',
    text: 'This step is attached to the bottom of the <code>.example-css-selector</code> element.',
    attachTo: {
        element: '.tour-try-it-out',
        on: 'bottom'
    },
    classes: 'example-step-extra-class',
    buttons: [
        {
            text: 'Next',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'example-step-2',
    text: 'This step is attached to the bottom of the <code>.example-css-selector</code> element.',
    attachTo: {
        element: '.tour-try-it-out-submit',
        on: 'bottom'
    },
    classes: 'example-step-extra-class',
    buttons: [
        {
            text: 'Next',
            action: tour.next
        }
    ]
});

//tour.start();