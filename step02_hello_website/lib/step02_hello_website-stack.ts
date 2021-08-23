import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origions from "@aws-cdk/aws-cloudfront-origins";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export class Step02HelloWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // create a bucket to upload your app files
    const websiteBucket = new s3.Bucket(this, "WebsiyeBucket", {
      versioned: true,
    });

    // create a CDN to deploy your website
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origions.S3Origin(websiteBucket),
      },
      defaultRootObject: "index.html",
    });

    // housekeeping for uploading the data in bucket
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./myweb")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/"],
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName,
    });
  }
}
