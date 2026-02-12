<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('pdf.{id}', fn (User $user, int $id) => $user->id === $id);
