<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HubContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180'],
            'organisation' => ['sometimes', 'nullable', 'string', 'max:180'],
            'subject' => ['required', 'string', Rule::in([
                'Collaboration & joint publication',
                'Manuscript submission',
                'Subscriptions & access',
                'Membership',
                'Rights & permissions',
                'General enquiry',
            ])],
            'message' => ['required', 'string', 'min:20', 'max:5000'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your name.',
            'email.required' => 'Please enter a valid email address, such as name@university.edu.',
            'email.email' => 'Please enter a valid email address, such as name@university.edu.',
            'subject.required' => 'Please choose a subject so we can route your message.',
            'subject.in' => 'Please choose a subject so we can route your message.',
            'message.required' => 'Please tell us a little more, at least 20 characters.',
            'message.min' => 'Please tell us a little more, at least 20 characters.',
        ];
    }
}
