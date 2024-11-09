import { BadRequestException, NotFoundException } from '@nestjs/common';

export function notExist(exist, message: string): void {
  if (!exist) throw new BadRequestException(message);
}

export function isExist(exist, message: string): void {
  if (exist) throw new BadRequestException(message);
}

export function objectLengthIsZero(object: any, message: string): void {
  if (object.length == 0) throw new BadRequestException(message);
}

export function notFound(found, message: string): void {
  if (!found) throw new NotFoundException(message);
}
