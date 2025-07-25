import { NextRequest } from 'next/server';

interface CustomNextRequest extends NextRequest {
    token?: string;
    id?: string;
    role?: string;
}