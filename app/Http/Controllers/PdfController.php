<?php

namespace App\Http\Controllers;

use App\Events\PdfStatusChanged;
use App\Jobs\BuildPdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PdfController extends Controller
{
    public function build(Request $request): Response
    {
        $orderId = $request->input('orderId');

        BuildPdf::dispatch($request->user(), $orderId);
        PdfStatusChanged::dispatch($request->user(), $orderId, 'pending');

        return response()->noContent();
    }
}
