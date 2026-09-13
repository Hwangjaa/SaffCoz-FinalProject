/* SaffCoz — contact form: inline validation + honest mailto submission */
(function () {
    'use strict';

    function setInvalid(field, invalid) {
        field.classList.toggle('invalid', invalid);
        var input = field.querySelector('input, textarea');
        if (input) input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }

    function validate(form) {
        var ok = true;
        var firstBad = null;

        function check(fieldEl, valid) {
            setInvalid(fieldEl, !valid);
            if (!valid) {
                ok = false;
                if (!firstBad) firstBad = fieldEl.querySelector('input, textarea') || fieldEl;
            }
        }

        var firstName = form.firstName.value.trim();
        var lastName = form.lastName.value.trim();
        var email = form.email.value.trim();
        var phone = form.phone.value.trim();
        var gender = form.gender.value;
        var message = form.message.value.trim();

        check(form.firstName.closest('.field'), firstName.length > 0);
        check(form.lastName.closest('.field'), lastName.length > 0);

        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        check(form.email.closest('.field'), emailOk);

        var phoneOk = /^[0-9]{10,13}$/.test(phone.replace(/[\s-]/g, ''));
        check(form.phone.closest('.field'), phoneOk);

        var genderField = form.querySelector('.gender-field');
        setInvalid(genderField, !gender);
        if (!gender) {
            ok = false;
            if (!firstBad) firstBad = genderField.querySelector('input');
        }

        check(form.message.closest('.field'), message.length > 0);

        if (firstBad) firstBad.focus();
        return ok;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('contactForm');
        if (!form) return;

        // live re-validation once a field was marked invalid
        form.addEventListener('input', function (e) {
            var field = e.target.closest('.field');
            if (field && field.classList.contains('invalid')) {
                validate(form);
            }
        });
        form.addEventListener('change', function (e) {
            var field = e.target.closest('.field');
            if (field && field.classList.contains('invalid')) {
                validate(form);
            }
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validate(form)) {
                SaffCoz.toast('Please review the highlighted fields.', { error: true });
                return;
            }

            var name = form.firstName.value.trim() + ' ' + form.lastName.value.trim();
            var body =
                'Name: ' + name + '\n' +
                'Email: ' + form.email.value.trim() + '\n' +
                'Phone: ' + form.phone.value.trim() + '\n' +
                'Gender: ' + form.gender.value + '\n\n' +
                form.message.value.trim();

            var mailto = 'mailto:hello@saffcoz.example?subject=' +
                encodeURIComponent('[SaffCoz Website] Message from ' + name) +
                '&body=' + encodeURIComponent(body);

            window.location.href = mailto;

            // replace form with a completion state (dialog closure: begin → done)
            var card = form.closest('.contact-form-card');
            var panel = document.createElement('div');
            panel.className = 'sent-panel';
            panel.innerHTML =
                '<p class="big">Thank you, ' + form.firstName.value.trim() + '</p>' +
                '<p>Your message has been prepared in your email app — just press send and we&rsquo;ll get back to you shortly.</p>' +
                '<button class="btn btn-outline" type="button">Write another message</button>';
            var again = panel.querySelector('button');
            again.addEventListener('click', function () {
                form.reset();
                form.querySelectorAll('.field.invalid').forEach(function (f) { f.classList.remove('invalid'); });
                panel.replaceWith(form);
            });
            form.replaceWith(panel);
        });
    });
})();
