import { IsString, IsUrl } from "class-validator";

export class CreateWebsiteDto {
  @IsString()
  @IsUrl(
    { require_protocol: true },
    {
      message: "Please enter a valid URL including http:// or https://",
    },
  )
  url!: string;
}
