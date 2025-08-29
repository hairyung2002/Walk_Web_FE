export interface Coordinates {
  lat: number;
  lng: number;
}

export interface KakaoMapAddress {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  mountain_yn: string;
  main_address_no: string;
  sub_address_no: string;
}

export interface KakaoMapResult {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoMapAddress[];
}
