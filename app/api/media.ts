import { MediaType } from '@/modules/media';
import { socketRequest } from '@/socket';
import { IMediaVO } from '@/store/media';
import { Res } from '.';

export async function reqGetMediaList(): Promise<Res<IMediaVO[]>> {
  return socketRequest('/media/list');
}

export async function reqBanMedia(
  memberId: string,
  type: MediaType
): Promise<Res<void>> {
  return socketRequest('/media/ban', {
    memberId,
    type
  });
}

export async function reqAllowMedia(
  memberId: string,
  type: MediaType
): Promise<Res<void>> {
  return socketRequest('/media/allow', {
    memberId,
    type
  });
}
