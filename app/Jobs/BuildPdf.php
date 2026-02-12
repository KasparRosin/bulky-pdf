<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Events\PdfStatusChanged;
use App\Models\User;

class BuildPdf implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user,
        public string $orderId,
    ) {
        $this->onQueue('pdf');
    }

    public function handle(): void
    {
        PdfStatusChanged::dispatch($this->user, $this->orderId, 'processing');

        sleep(rand(5, 15));

        PdfStatusChanged::dispatch($this->user, $this->orderId, 'completed');
    }
}
