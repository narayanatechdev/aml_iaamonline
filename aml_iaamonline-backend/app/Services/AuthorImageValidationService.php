<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthorImageValidationService
{
    private const REQUIRED_WIDTH = 400;

    private const REQUIRED_HEIGHT = 400;

    private const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    private const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

    private const STORAGE_DISK = 's3'; // or 'public' for local

    private const STORAGE_PATH = 'author-images';

    /**
     * Validate author image file
     *
     * @throws ValidationException
     */
    public static function validate(UploadedFile $file): array
    {
        self::validateMimeType($file);
        self::validateFileSize($file);
        self::validateDimensions($file);

        return [
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ];
    }

    /**
     * Store author image and return URL
     *
     * @return string URL of stored image
     *
     * @throws ValidationException
     */
    public static function store(UploadedFile $file, string $authorEmail): string
    {
        self::validate($file);

        $filename = self::generateFilename($authorEmail, $file->getClientOriginalExtension());
        $path = self::STORAGE_PATH.'/'.$filename;

        Storage::disk(self::STORAGE_DISK)->put(
            $path,
            file_get_contents($file->getRealPath()),
            'public'
        );

        return Storage::disk(self::STORAGE_DISK)->url($path);
    }

    /**
     * Delete author image from storage
     */
    public static function delete(string $imageUrl): void
    {
        if (empty($imageUrl)) {
            return;
        }

        $path = str_replace(Storage::disk(self::STORAGE_DISK)->url(''), '', $imageUrl);
        if (Storage::disk(self::STORAGE_DISK)->exists($path)) {
            Storage::disk(self::STORAGE_DISK)->delete($path);
        }
    }

    /**
     * Validate MIME type
     *
     * @throws ValidationException
     */
    private static function validateMimeType(UploadedFile $file): void
    {
        if (! in_array($file->getMimeType(), self::ALLOWED_MIME_TYPES)) {
            throw ValidationException::withMessages([
                'author_image' => 'Image must be a JPEG or PNG file.',
            ]);
        }
    }

    /**
     * Validate file size
     *
     * @throws ValidationException
     */
    private static function validateFileSize(UploadedFile $file): void
    {
        if ($file->getSize() > self::MAX_FILE_SIZE) {
            throw ValidationException::withMessages([
                'author_image' => 'Image size must not exceed 5MB.',
            ]);
        }
    }

    /**
     * Validate image dimensions
     *
     * @throws ValidationException
     */
    private static function validateDimensions(UploadedFile $file): void
    {
        $imageSize = getimagesize($file->getRealPath());

        if (! $imageSize) {
            throw ValidationException::withMessages([
                'author_image' => 'Unable to read image file.',
            ]);
        }

        [$width, $height] = $imageSize;

        if ($width !== self::REQUIRED_WIDTH || $height !== self::REQUIRED_HEIGHT) {
            throw ValidationException::withMessages([
                'author_image' => 'Image dimensions must be exactly '.self::REQUIRED_WIDTH.'x'.self::REQUIRED_HEIGHT.' pixels.',
            ]);
        }
    }

    /**
     * Generate unique filename for author image
     */
    private static function generateFilename(string $authorEmail, string $extension): string
    {
        $sanitized = str_replace('@', '_at_', $authorEmail);
        $timestamp = now()->timestamp;

        return "{$sanitized}_{$timestamp}.{$extension}";
    }
}
